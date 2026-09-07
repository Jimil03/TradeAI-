import hashlib
from decimal import Decimal, InvalidOperation
from io import BytesIO

import pandas as pd
from sqlalchemy.orm import Session

from app.models.trade import Trade
from app.models.import_batch import ImportBatch

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {".csv"}

REQUIRED_COLUMNS = {"symbol", "direction", "quantity", "entry_price", "entry_time"}
OPTIONAL_COLUMNS = {
    "exchange", "asset_type", "exit_price", "exit_time",
    "stop_loss", "target", "fees", "taxes", "notes", "strategy",
}


class CSVImportError(Exception):
    pass


def compute_dedupe_hash(symbol: str, direction: str, quantity: str, entry_price: str, entry_time: str) -> str:
    raw = f"{symbol.strip().upper()}|{direction.strip().upper()}|{quantity}|{entry_price}|{entry_time}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def validate_filename_and_size(filename: str, size_bytes: int) -> None:
    if not any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise CSVImportError("Only .csv files are supported.")
    if size_bytes > MAX_FILE_SIZE_BYTES:
        raise CSVImportError("File exceeds the 5 MB size limit.")


def parse_csv(file_bytes: bytes) -> pd.DataFrame:
    try:
        df = pd.read_csv(BytesIO(file_bytes), encoding="utf-8")
    except UnicodeDecodeError:
        try:
            df = pd.read_csv(BytesIO(file_bytes), encoding="latin-1")
        except Exception as e:
            raise CSVImportError(f"Could not read file encoding: {e}")
    except Exception as e:
        raise CSVImportError(f"Could not parse CSV: {e}")

    df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise CSVImportError(f"Missing required columns: {', '.join(sorted(missing))}")

    return df


def _to_decimal(value, field_name: str, row_number: int) -> Decimal:
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        raise CSVImportError(f"Row {row_number}: invalid number for '{field_name}': {value!r}")


def process_import(
    db: Session,
    user_id,
    filename: str,
    file_bytes: bytes,
) -> ImportBatch:
    validate_filename_and_size(filename, len(file_bytes))
    df = parse_csv(file_bytes)

    batch = ImportBatch(
        user_id=user_id,
        filename=filename,
        status="processing",
        total_rows=len(df),
    )
    db.add(batch)
    db.flush()

    imported = 0
    skipped = 0
    errors: list[str] = []

    for idx, row in df.iterrows():
        row_number = idx + 2
        try:
            symbol = str(row["symbol"]).strip()
            direction = str(row["direction"]).strip().upper()
            if direction not in ("LONG", "SHORT"):
                raise CSVImportError(f"Row {row_number}: direction must be LONG or SHORT, got {direction!r}")

            quantity = _to_decimal(row["quantity"], "quantity", row_number)
            entry_price = _to_decimal(row["entry_price"], "entry_price", row_number)
            entry_time = pd.to_datetime(row["entry_time"], utc=True, errors="raise")

            dedupe_hash = compute_dedupe_hash(symbol, direction, str(quantity), str(entry_price), str(entry_time))

            existing = (
                db.query(Trade)
                .filter(Trade.user_id == user_id, Trade.dedupe_hash == dedupe_hash)
                .first()
            )
            if existing:
                skipped += 1
                errors.append(f"Row {row_number}: duplicate trade, skipped")
                continue

            trade = Trade(
                user_id=user_id,
                symbol=symbol,
                exchange=str(row.get("exchange")) if pd.notna(row.get("exchange")) else None,
                asset_type=str(row.get("asset_type")) if pd.notna(row.get("asset_type")) else "equity",
                direction=direction,
                quantity=quantity,
                entry_price=entry_price,
                exit_price=_to_decimal(row["exit_price"], "exit_price", row_number) if pd.notna(row.get("exit_price")) else None,
                entry_time=entry_time,
                exit_time=pd.to_datetime(row["exit_time"], utc=True, errors="coerce") if pd.notna(row.get("exit_time")) else None,
                stop_loss=_to_decimal(row["stop_loss"], "stop_loss", row_number) if pd.notna(row.get("stop_loss")) else None,
                target=_to_decimal(row["target"], "target", row_number) if pd.notna(row.get("target")) else None,
                fees=_to_decimal(row["fees"], "fees", row_number) if pd.notna(row.get("fees")) else Decimal("0"),
                taxes=_to_decimal(row["taxes"], "taxes", row_number) if pd.notna(row.get("taxes")) else Decimal("0"),
                notes=str(row.get("notes")) if pd.notna(row.get("notes")) else None,
                strategy=str(row.get("strategy")) if pd.notna(row.get("strategy")) else None,
                source="csv_import",
                dedupe_hash=dedupe_hash,
            )
            db.add(trade)
            imported += 1

        except CSVImportError as e:
            skipped += 1
            errors.append(str(e))
        except Exception as e:
            skipped += 1
            errors.append(f"Row {row_number}: unexpected error: {e}")

    batch.imported_rows = imported
    batch.skipped_rows = skipped
    batch.status = "completed"
    batch.error_summary = "\n".join(errors[:50]) if errors else None

    db.commit()
    db.refresh(batch)
    return batch
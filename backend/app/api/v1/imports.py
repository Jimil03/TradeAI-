from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.import_batch import ImportBatch
from app.schemas.import_batch import ImportBatchResponse
from app.services.csv_import import process_import, CSVImportError

router = APIRouter(prefix="/api/v1/imports", tags=["imports"])


@router.post("", response_model=ImportBatchResponse, status_code=status.HTTP_201_CREATED)
def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file_bytes = file.file.read()
    try:
        batch = process_import(db, current_user.id, file.filename, file_bytes)
    except CSVImportError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return batch


@router.get("", response_model=list[ImportBatchResponse])
def list_imports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ImportBatch)
        .filter(ImportBatch.user_id == current_user.id)
        .order_by(ImportBatch.created_at.desc())
        .all()
    )
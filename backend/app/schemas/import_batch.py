import uuid
from datetime import datetime

from pydantic import BaseModel


class ImportBatchResponse(BaseModel):
    id: uuid.UUID
    filename: str
    status: str
    total_rows: int
    imported_rows: int
    skipped_rows: int
    error_summary: str | None
    created_at: datetime

    class Config:
        from_attributes = True
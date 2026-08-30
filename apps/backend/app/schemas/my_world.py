from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.enums import MyWorldCategory


class MyWorldItemCreate(BaseModel):
    category: MyWorldCategory
    name: str
    relationship: str | None = None
    description: str | None = None
    photo_uri: str | None = None


class MyWorldItemResponse(BaseModel):
    id: UUID
    patient_id: UUID
    category: MyWorldCategory
    name: str
    relationship: str | None
    description: str | None
    photo_uri: str | None
    success_rate: float | None
    times_shown: int
    last_shown_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MyWorldInteractionReport(BaseModel):
    was_correct: bool
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserRole(str, Enum):
    PATIENT = "patient"
    CAREGIVER = "caregiver"
    ADMIN = "admin"


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    sub: Optional[str] = None
    role: Optional[UserRole] = None


class PatientBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    full_name: str
    date_of_birth: Optional[str] = None
    region: Optional[str] = None
    notes: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: str
    caregiver_id: Optional[str] = None


class CaregiverBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    full_name: str
    email: str
    phone: Optional[str] = None


class CaregiverResponse(CaregiverBase):
    id: str


class GameSessionBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: str
    game_type: str
    score: Optional[int] = None
    duration_seconds: Optional[int] = None


class GameSessionResponse(GameSessionBase):
    id: str
    played_at: datetime


class ReminderBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: str
    title: str
    message: Optional[str] = None
    scheduled_at: datetime


class ReminderResponse(ReminderBase):
    id: str
    is_sent: bool = False

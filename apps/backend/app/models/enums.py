import enum


class UserRole(str, enum.Enum):
    CAREGIVER = "caregiver"
    ADMIN = "admin"


class AuthRole(str, enum.Enum):
    PATIENT = "patient"
    CAREGIVER = "caregiver"
    ADMIN = "admin"


class GameType(str, enum.Enum):
    MEMORY_MATCH = "memory_match"
    SEQUENCE_RECALL = "sequence_recall"
    OBJECT_RECOGNITION = "object_recognition"


class ReminderType(str, enum.Enum):
    MEDICINE = "medicine"
    HYDRATION = "hydration"
    ACTIVITY = "activity"
    APPOINTMENT = "appointment"

class MyWorldCategory(str, enum.Enum):
    PERSON = "person"
    PLACE = "place"
    OBJECT = "object"
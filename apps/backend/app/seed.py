"""Seed demo users, patients, reminders, and game sessions."""

import uuid
from datetime import date, datetime, time, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import GameSession, Patient, Reminder, User
from app.models.enums import GameType, ReminderType, UserRole

# Stable demo IDs for hackathon / API docs
ADMIN_ID = uuid.UUID("00000000-0000-4000-8000-000000000001")
CAREGIVER_1_ID = uuid.UUID("00000000-0000-4000-8000-000000000002")
CAREGIVER_2_ID = uuid.UUID("00000000-0000-4000-8000-000000000003")
PATIENT_1_ID = uuid.UUID("00000000-0000-4000-8000-000000000101")
PATIENT_2_ID = uuid.UUID("00000000-0000-4000-8000-000000000102")
PATIENT_3_ID = uuid.UUID("00000000-0000-4000-8000-000000000103")

DEMO_ADMIN_EMAIL = "admin@coco-demo.io"
DEMO_ADMIN_PASSWORD = "admin12345"
DEMO_CAREGIVER_EMAIL = "caregiver@coco-demo.io"
DEMO_CAREGIVER_PASSWORD = "caregiver12"


def seed_database(db: Session) -> None:
    if db.query(User).filter(User.email == DEMO_ADMIN_EMAIL).first():
        return

    now = datetime.now(timezone.utc)
    today = datetime.combine(now.date(), time.min, tzinfo=timezone.utc)

    admin = User(
        id=ADMIN_ID,
        email=DEMO_ADMIN_EMAIL,
        password_hash=hash_password(DEMO_ADMIN_PASSWORD),
        role=UserRole.ADMIN,
        full_name="Coco Admin",
        region="Assam",
    )
    caregiver1 = User(
        id=CAREGIVER_1_ID,
        email=DEMO_CAREGIVER_EMAIL,
        password_hash=hash_password(DEMO_CAREGIVER_PASSWORD),
        role=UserRole.CAREGIVER,
        full_name="Priya Sharma",
        phone="+91-98765-43210",
        region="Assam",
    )
    caregiver2 = User(
        id=CAREGIVER_2_ID,
        email="caregiver2@coco-demo.io",
        password_hash=hash_password("caregiver22"),
        role=UserRole.CAREGIVER,
        full_name="Meera Boro",
        region="Meghalaya",
    )
    db.add_all([admin, caregiver1, caregiver2])

    patient1 = Patient(
        id=PATIENT_1_ID,
        caregiver_id=CAREGIVER_1_ID,
        full_name="Lakshmi Devi",
        date_of_birth=date(1945, 3, 12),
        region="Assam",
        preferred_language="as",
        pin_hash=hash_password("1234"),
        cognitive_level=2,
    )
    patient2 = Patient(
        id=PATIENT_2_ID,
        caregiver_id=CAREGIVER_1_ID,
        full_name="Rajen Das",
        date_of_birth=date(1940, 8, 22),
        region="Assam",
        preferred_language="as",
        pin_hash=hash_password("5678"),
        cognitive_level=3,
    )
    patient3 = Patient(
        id=PATIENT_3_ID,
        caregiver_id=CAREGIVER_2_ID,
        full_name="Anjali Sharma",
        date_of_birth=date(1952, 11, 5),
        region="Meghalaya",
        preferred_language="en",
        pin_hash=hash_password("0000"),
        cognitive_level=1,
    )
    db.add_all([patient1, patient2, patient3])

    reminders = [
        Reminder(
            patient_id=PATIENT_1_ID,
            title="Morning medicine",
            reminder_type=ReminderType.MEDICINE,
            scheduled_at=today.replace(hour=9),
        ),
        Reminder(
            patient_id=PATIENT_1_ID,
            title="Drink a glass of water",
            reminder_type=ReminderType.HYDRATION,
            scheduled_at=today.replace(hour=11),
        ),
        Reminder(
            patient_id=PATIENT_1_ID,
            title="Doctor visit at clinic",
            reminder_type=ReminderType.APPOINTMENT,
            scheduled_at=today.replace(hour=14),
        ),
    ]
    db.add_all(reminders)

    # --------------------------------------------------------------------
    # Game session histories - hand-designed to demo three distinct AI
    # engine narratives:
    #   Lakshmi (Assam, cognitive_level=2): a rough middle session, then a
    #       strong recovery streak -> AI recommends INCREASE to level 3.
    #   Rajen (Assam, cognitive_level=3): steadily declining performance
    #       -> AI recommends DECREASE and analytics fires decline_alert=True
    #       (early cognitive intervention, straight from the problem statement).
    #   Anjali (Meghalaya, cognitive_level=1): stable/mild improvement,
    #       demos the Khasi Hills regional theme alongside Lakshmi/Rajen's
    #       Assam theme.
    # --------------------------------------------------------------------
    sessions = [
        # ---- Lakshmi Devi: dip then strong recovery -> increase ----
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.MEMORY_MATCH,
            score=60, duration_seconds=150, difficulty_level=2,
            played_at=now - timedelta(days=8),
        ),
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.SEQUENCE_RECALL,
            score=55, duration_seconds=160, difficulty_level=2,
            played_at=now - timedelta(days=7),
        ),
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.MEMORY_MATCH,
            score=68, duration_seconds=120, difficulty_level=2,
            played_at=now - timedelta(days=6),
        ),
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.OBJECT_RECOGNITION,
            score=70, duration_seconds=140, difficulty_level=2,
            played_at=now - timedelta(days=5),
        ),
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.MEMORY_MATCH,
            score=78, duration_seconds=90, difficulty_level=2,
            played_at=now - timedelta(days=4),
        ),
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.SEQUENCE_RECALL,
            score=82, duration_seconds=80, difficulty_level=2,
            played_at=now - timedelta(days=3),
        ),
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.MEMORY_MATCH,
            score=45, duration_seconds=250, difficulty_level=2,
            played_at=now - timedelta(days=2),  # a rough "off day"
        ),
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.OBJECT_RECOGNITION,
            score=88, duration_seconds=80, difficulty_level=2,
            played_at=now - timedelta(days=1),
        ),
        GameSession(
            patient_id=PATIENT_1_ID, game_type=GameType.MEMORY_MATCH,
            score=91, duration_seconds=70, difficulty_level=2,
            played_at=now,
        ),

        # ---- Rajen Das: steady decline -> decrease + decline_alert ----
        GameSession(
            patient_id=PATIENT_2_ID, game_type=GameType.OBJECT_RECOGNITION,
            score=75, duration_seconds=120, difficulty_level=3,
            played_at=now - timedelta(days=6),
        ),
        GameSession(
            patient_id=PATIENT_2_ID, game_type=GameType.MEMORY_MATCH,
            score=70, duration_seconds=150, difficulty_level=3,
            played_at=now - timedelta(days=5),
        ),
        GameSession(
            patient_id=PATIENT_2_ID, game_type=GameType.OBJECT_RECOGNITION,
            score=62, duration_seconds=200, difficulty_level=3,
            played_at=now - timedelta(days=4),
        ),
        GameSession(
            patient_id=PATIENT_2_ID, game_type=GameType.MEMORY_MATCH,
            score=55, duration_seconds=250, difficulty_level=3,
            played_at=now - timedelta(days=3),
        ),
        GameSession(
            patient_id=PATIENT_2_ID, game_type=GameType.OBJECT_RECOGNITION,
            score=48, duration_seconds=300, difficulty_level=3,
            played_at=now - timedelta(days=2),
        ),
        GameSession(
            patient_id=PATIENT_2_ID, game_type=GameType.MEMORY_MATCH,
            score=40, duration_seconds=330, difficulty_level=3,
            played_at=now - timedelta(days=1),
        ),
        GameSession(
            patient_id=PATIENT_2_ID, game_type=GameType.OBJECT_RECOGNITION,
            score=35, duration_seconds=350, difficulty_level=3,
            played_at=now,
        ),

        # ---- Anjali Sharma: stable / mild improvement, Meghalaya theme ----
        GameSession(
            patient_id=PATIENT_3_ID, game_type=GameType.MEMORY_MATCH,
            score=58, duration_seconds=160, difficulty_level=1,
            played_at=now - timedelta(days=3),
        ),
        GameSession(
            patient_id=PATIENT_3_ID, game_type=GameType.SEQUENCE_RECALL,
            score=62, duration_seconds=144, difficulty_level=1,
            played_at=now - timedelta(days=2),
        ),
        GameSession(
            patient_id=PATIENT_3_ID, game_type=GameType.MEMORY_MATCH,
            score=60, duration_seconds=170, difficulty_level=1,
            played_at=now - timedelta(days=1),
        ),
        GameSession(
            patient_id=PATIENT_3_ID, game_type=GameType.OBJECT_RECOGNITION,
            score=65, duration_seconds=150, difficulty_level=1,
            played_at=now,
        ),
    ]
    db.add_all(sessions)
    db.commit()


def main() -> None:
    from app.database import SessionLocal

    db = SessionLocal()
    try:
        seed_database(db)
        print("Seed data applied.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

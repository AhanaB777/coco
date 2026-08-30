"""Seed demo users, patients, reminders, game sessions, and My World items."""

import uuid
from datetime import date, datetime, time, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import GameSession, Patient, Reminder, User
from app.models.enums import GameType, MyWorldCategory, ReminderType, UserRole
from app.models.my_world_item import MyWorldItem


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

    today = datetime.combine(
        now.date(),
        time.min,
        tzinfo=timezone.utc,
    )

    # --------------------------------------------------------------------
    # Users
    # --------------------------------------------------------------------

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

    # --------------------------------------------------------------------
    # Patients
    # --------------------------------------------------------------------

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
    db.flush()
    # --------------------------------------------------------------------
    # Reminders
    # --------------------------------------------------------------------

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
    # Game session histories
    #
    # Lakshmi:
    # rough middle session, then strong recovery streak
    # -> AI recommends increase to level 3.
    #
    # Rajen:
    # steadily declining performance
    # -> AI recommends decrease and decline_alert=True.
    #
    # Anjali:
    # stable / mild improvement, demonstrating Meghalaya theme.
    # --------------------------------------------------------------------

    sessions = [
        # ---- Lakshmi Devi: dip then strong recovery -> increase ----

        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.MEMORY_MATCH,
            score=60,
            duration_seconds=150,
            difficulty_level=2,
            played_at=now - timedelta(days=8),
        ),
        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.SEQUENCE_RECALL,
            score=55,
            duration_seconds=160,
            difficulty_level=2,
            played_at=now - timedelta(days=7),
        ),
        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.MEMORY_MATCH,
            score=68,
            duration_seconds=120,
            difficulty_level=2,
            played_at=now - timedelta(days=6),
        ),
        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.OBJECT_RECOGNITION,
            score=70,
            duration_seconds=140,
            difficulty_level=2,
            played_at=now - timedelta(days=5),
        ),
        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.MEMORY_MATCH,
            score=78,
            duration_seconds=90,
            difficulty_level=2,
            played_at=now - timedelta(days=4),
        ),
        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.SEQUENCE_RECALL,
            score=82,
            duration_seconds=80,
            difficulty_level=2,
            played_at=now - timedelta(days=3),
        ),
        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.MEMORY_MATCH,
            score=45,
            duration_seconds=250,
            difficulty_level=2,
            played_at=now - timedelta(days=2),
        ),
        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.OBJECT_RECOGNITION,
            score=88,
            duration_seconds=80,
            difficulty_level=2,
            played_at=now - timedelta(days=1),
        ),
        GameSession(
            patient_id=PATIENT_1_ID,
            game_type=GameType.MEMORY_MATCH,
            score=91,
            duration_seconds=70,
            difficulty_level=2,
            played_at=now,
        ),

        # ---- Rajen Das: steady decline -> decrease + decline_alert ----

        GameSession(
            patient_id=PATIENT_2_ID,
            game_type=GameType.OBJECT_RECOGNITION,
            score=75,
            duration_seconds=120,
            difficulty_level=3,
            played_at=now - timedelta(days=6),
        ),
        GameSession(
            patient_id=PATIENT_2_ID,
            game_type=GameType.MEMORY_MATCH,
            score=70,
            duration_seconds=150,
            difficulty_level=3,
            played_at=now - timedelta(days=5),
        ),
        GameSession(
            patient_id=PATIENT_2_ID,
            game_type=GameType.OBJECT_RECOGNITION,
            score=62,
            duration_seconds=200,
            difficulty_level=3,
            played_at=now - timedelta(days=4),
        ),
        GameSession(
            patient_id=PATIENT_2_ID,
            game_type=GameType.MEMORY_MATCH,
            score=55,
            duration_seconds=250,
            difficulty_level=3,
            played_at=now - timedelta(days=3),
        ),
        GameSession(
            patient_id=PATIENT_2_ID,
            game_type=GameType.OBJECT_RECOGNITION,
            score=48,
            duration_seconds=300,
            difficulty_level=3,
            played_at=now - timedelta(days=2),
        ),
        GameSession(
            patient_id=PATIENT_2_ID,
            game_type=GameType.MEMORY_MATCH,
            score=40,
            duration_seconds=330,
            difficulty_level=3,
            played_at=now - timedelta(days=1),
        ),
        GameSession(
            patient_id=PATIENT_2_ID,
            game_type=GameType.OBJECT_RECOGNITION,
            score=35,
            duration_seconds=350,
            difficulty_level=3,
            played_at=now,
        ),

        # ---- Anjali Sharma: stable / mild improvement, Meghalaya theme ----

        GameSession(
            patient_id=PATIENT_3_ID,
            game_type=GameType.MEMORY_MATCH,
            score=58,
            duration_seconds=160,
            difficulty_level=1,
            played_at=now - timedelta(days=3),
        ),
        GameSession(
            patient_id=PATIENT_3_ID,
            game_type=GameType.SEQUENCE_RECALL,
            score=62,
            duration_seconds=144,
            difficulty_level=1,
            played_at=now - timedelta(days=2),
        ),
        GameSession(
            patient_id=PATIENT_3_ID,
            game_type=GameType.MEMORY_MATCH,
            score=60,
            duration_seconds=170,
            difficulty_level=1,
            played_at=now - timedelta(days=1),
        ),
        GameSession(
            patient_id=PATIENT_3_ID,
            game_type=GameType.OBJECT_RECOGNITION,
            score=65,
            duration_seconds=150,
            difficulty_level=1,
            played_at=now,
        ),
    ]

    db.add_all(sessions)

    # --------------------------------------------------------------------
    # My World demo data
    #
    # These are personalized memories used by the AI Personalization
    # Engine. Lower success_rate means the item needs more reinforcement.
    #
    # Lakshmi:
    #   Priya       -> 35% (priority candidate)
    #   Rohan       -> 80%
    #   Old house   -> 70%
    #
    # Rajen:
    #   Meena       -> 40% (priority candidate)
    #   Amit        -> 75%
    #
    # Anjali:
    #   Neha        -> 45% (priority candidate)
    #   Family garden -> 75%
    # --------------------------------------------------------------------

    my_world_items = [
        # ---- Lakshmi Devi ----

        MyWorldItem(
            id=uuid.UUID("00000000-0000-4000-8000-000000001001"),
            patient_id=PATIENT_1_ID,
            category=MyWorldCategory.PERSON,
            name="Priya",
            relationship="daughter",
            description="Lakshmi's daughter Priya",
            photo_uri="/demo/priya.jpg",
            success_rate=0.35,
            times_shown=5,
        ),

        MyWorldItem(
            id=uuid.UUID("00000000-0000-4000-8000-000000001002"),
            patient_id=PATIENT_1_ID,
            category=MyWorldCategory.PERSON,
            name="Rohan",
            relationship="grandson",
            description="Lakshmi's grandson Rohan",
            photo_uri="/demo/rohan.jpg",
            success_rate=0.80,
            times_shown=5,
        ),

        MyWorldItem(
            id=uuid.UUID("00000000-0000-4000-8000-000000001003"),
            patient_id=PATIENT_1_ID,
            category=MyWorldCategory.PLACE,
            name="Our old house",
            relationship=None,
            description="The family home",
            photo_uri="/demo/old-house.jpg",
            success_rate=0.70,
            times_shown=5,
        ),

        # ---- Rajen Das ----

        MyWorldItem(
            id=uuid.UUID("00000000-0000-4000-8000-000000001011"),
            patient_id=PATIENT_2_ID,
            category=MyWorldCategory.PERSON,
            name="Meena",
            relationship="daughter",
            description="Rajen's daughter Meena",
            photo_uri="/demo/meena.jpg",
            success_rate=0.40,
            times_shown=4,
        ),

        MyWorldItem(
            id=uuid.UUID("00000000-0000-4000-8000-000000001012"),
            patient_id=PATIENT_2_ID,
            category=MyWorldCategory.PERSON,
            name="Amit",
            relationship="son",
            description="Rajen's son Amit",
            photo_uri="/demo/amit.jpg",
            success_rate=0.75,
            times_shown=4,
        ),

        # ---- Anjali Sharma ----

        MyWorldItem(
            id=uuid.UUID("00000000-0000-4000-8000-000000001021"),
            patient_id=PATIENT_3_ID,
            category=MyWorldCategory.PERSON,
            name="Neha",
            relationship="daughter",
            description="Anjali's daughter Neha",
            photo_uri="/demo/neha.jpg",
            success_rate=0.45,
            times_shown=3,
        ),

        MyWorldItem(
            id=uuid.UUID("00000000-0000-4000-8000-000000001022"),
            patient_id=PATIENT_3_ID,
            category=MyWorldCategory.PLACE,
            name="Family garden",
            relationship=None,
            description="The garden near their family home",
            photo_uri="/demo/family-garden.jpg",
            success_rate=0.75,
            times_shown=3,
        ),
    ]

    db.add_all(my_world_items)

    # Commit everything together
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


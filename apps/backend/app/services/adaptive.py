from uuid import UUID

from sqlalchemy.orm import Session

from app.config import settings
from app.models import GameSession


# TODO: [ML teammate] replace with real adaptive model using performance history
def get_next_difficulty(db: Session, patient_id: UUID, cognitive_level: int) -> int:
    sessions = (
        db.query(GameSession)
        .filter(GameSession.patient_id == patient_id)
        .order_by(GameSession.played_at.desc())
        .limit(5)
        .all()
    )
    if not sessions:
        return max(1, min(cognitive_level, 3))

    avg_score = sum(s.score or 0 for s in sessions) / len(sessions)
    if avg_score >= 80:
        return min(5, cognitive_level + 1)
    if avg_score < 50:
        return max(1, cognitive_level - 1)
    return cognitive_level

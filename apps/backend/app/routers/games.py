from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import AuthContext, get_patient_for_auth, require_roles
from app.core.security import AuthRole
from app.database import get_db
from app.models import GameSession
from app.schemas.game import DifficultyResponse, GameSessionCreate, GameSessionResponse
from app.services.adaptive import get_next_difficulty

router = APIRouter(prefix="/games", tags=["games"])


def _session_response(session: GameSession) -> GameSessionResponse:
    return GameSessionResponse(
        id=str(session.id),
        patient_id=str(session.patient_id),
        game_type=session.game_type,
        score=session.score,
        duration_seconds=session.duration_seconds,
        difficulty_level=session.difficulty_level,
        played_at=session.played_at,
    )


@router.get("/sessions", response_model=list[GameSessionResponse])
def list_game_sessions(
    patient_id: UUID = Query(...),
    auth: AuthContext = Depends(require_roles(AuthRole.CAREGIVER, AuthRole.PATIENT)),
    db: Session = Depends(get_db),
):
    get_patient_for_auth(patient_id, auth, db)
    sessions = (
        db.query(GameSession)
        .filter(GameSession.patient_id == patient_id)
        .order_by(GameSession.played_at.desc())
        .all()
    )
    return [_session_response(s) for s in sessions]


@router.post("/sessions", response_model=GameSessionResponse, status_code=201)
def create_game_session(
    payload: GameSessionCreate,
    auth: AuthContext = Depends(require_roles(AuthRole.CAREGIVER, AuthRole.PATIENT)),
    db: Session = Depends(get_db),
):
    patient_uuid = UUID(payload.patient_id)
    patient = get_patient_for_auth(patient_uuid, auth, db)

    difficulty = payload.difficulty_level or get_next_difficulty(
        db, patient.id, patient.cognitive_level
    )

    session = GameSession(
        patient_id=patient.id,
        game_type=payload.game_type,
        score=payload.score,
        duration_seconds=payload.duration_seconds,
        difficulty_level=difficulty,
        played_at=datetime.now(timezone.utc),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return _session_response(session)


@router.get("/difficulty/{patient_id}", response_model=DifficultyResponse)
def get_difficulty(
    patient_id: UUID,
    auth: AuthContext = Depends(require_roles(AuthRole.CAREGIVER, AuthRole.PATIENT)),
    db: Session = Depends(get_db),
):
    patient = get_patient_for_auth(patient_id, auth, db)
    suggested = get_next_difficulty(db, patient.id, patient.cognitive_level)
    return DifficultyResponse(
        patient_id=str(patient.id),
        suggested_difficulty=suggested,
        cognitive_level=patient.cognitive_level,
    )

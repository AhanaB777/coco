from fastapi import APIRouter

router = APIRouter(prefix="/games", tags=["games"])


@router.get("/sessions")
async def list_game_sessions():
    """List game sessions."""
    return {"sessions": [], "message": "Games endpoint — not yet implemented"}


@router.post("/sessions")
async def create_game_session():
    """Record a new game session."""
    return {"message": "Create game session — not yet implemented"}

from fastapi import APIRouter

router = APIRouter(prefix="/reminders", tags=["reminders"])


@router.get("/")
async def list_reminders():
    """List reminders for a patient."""
    return {"reminders": [], "message": "Reminders endpoint — not yet implemented"}


@router.post("/")
async def create_reminder():
    """Create a new reminder."""
    return {"message": "Create reminder — not yet implemented"}

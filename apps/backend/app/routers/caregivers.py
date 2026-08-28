from fastapi import APIRouter

router = APIRouter(prefix="/caregivers", tags=["caregivers"])


@router.get("/")
async def list_caregivers():
    """List caregivers assigned to the current user context."""
    return {"caregivers": [], "message": "Caregivers endpoint — not yet implemented"}


@router.get("/me")
async def get_current_caregiver():
    """Get the authenticated caregiver profile."""
    return {"message": "Caregiver profile — not yet implemented"}

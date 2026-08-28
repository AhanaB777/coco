from fastapi import APIRouter

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/{patient_id}")
async def get_patient_progress(patient_id: str):
    """Get cognitive progress metrics for a patient."""
    return {
        "patient_id": patient_id,
        "message": "Progress endpoint — not yet implemented",
    }

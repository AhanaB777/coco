from fastapi import APIRouter

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("/")
async def list_patients():
    """List patients for the authenticated caregiver."""
    return {"patients": [], "message": "Patients endpoint — not yet implemented"}


@router.get("/{patient_id}")
async def get_patient(patient_id: str):
    """Get a single patient by ID."""
    return {"patient_id": patient_id, "message": "Patient detail — not yet implemented"}

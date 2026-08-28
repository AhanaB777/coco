from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
async def get_platform_stats():
    """Platform-wide aggregate statistics."""
    return {"message": "Admin stats — not yet implemented"}


@router.get("/health")
async def get_system_health():
    """System health overview for admin dashboard."""
    return {"status": "ok", "message": "Admin health — not yet implemented"}

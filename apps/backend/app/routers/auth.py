from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login():
    """Authenticate user and return JWT token."""
    return {"message": "Auth endpoint — not yet implemented"}


@router.post("/register")
async def register():
    """Register a new user."""
    return {"message": "Register endpoint — not yet implemented"}

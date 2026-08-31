from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.security import verify_password, create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import Token, LoginRequest, UserOut
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(
        (User.username == req.username_or_email) | (User.email == req.username_or_email)
    )
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is disabled")

    roles = [r.name for r in user.roles]
    permissions = []
    for r in user.roles:
        for p in r.permissions:
            permissions.append(p.code)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        subject=str(user.id),
        roles=roles,
        permissions=list(set(permissions)),
        expires_delta=access_token_expires
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

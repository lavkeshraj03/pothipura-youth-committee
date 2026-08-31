from typing import Generator, Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception

    stmt = select(User).where(User.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user

def require_permissions(required_permissions: List[str]):
    async def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        user_roles = [r.name for r in current_user.roles]
        if "SUPER_ADMIN" in user_roles:
            return current_user  # Super Admin has all permissions
        
        user_perms = set()
        for r in current_user.roles:
            for p in r.permissions:
                user_perms.add(p.code)
        
        for req in required_permissions:
            if req not in user_perms:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing required permission: {req}"
                )
        return current_user
    return permission_checker

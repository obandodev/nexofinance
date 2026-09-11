from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.auth.schemas.user import (
    UserOut,
    ProfileUpdate,
    ChangePasswordRequest,
)

from app.modules.auth.services.auth_service import (
    update_profile,
    change_password,
)

router = APIRouter()


@router.get("/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user)):
    return user


@router.patch("/me", response_model=UserOut)
def update_me(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return update_profile(db, user.id, data)


@router.post("/me/change-password")
def change_my_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return change_password(db, user.id, data)
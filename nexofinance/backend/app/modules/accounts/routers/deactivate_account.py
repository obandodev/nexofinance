from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.accounts.schemas.account import AccountOut
from app.modules.accounts.services.account_service import deactivate_account
router=APIRouter()
@router.patch("/{account_id}/deactivate", response_model=AccountOut)
def endpoint(account_id: int, db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    return deactivate_account(db, account_id, user.id)

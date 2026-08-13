from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.accounts.schemas.account import AccountOut
from app.modules.accounts.services.account_service import list_accounts
router=APIRouter()
@router.get("/", response_model=list[AccountOut])
def endpoint(db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    return list_accounts(db, user.id)

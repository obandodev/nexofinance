from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.accounts.schemas.account import AccountCreate, AccountOut
from app.modules.accounts.services.account_service import create_account
router=APIRouter()
@router.post("/", response_model=AccountOut)
def endpoint(data: AccountCreate, db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    return create_account(db, data, user.id)

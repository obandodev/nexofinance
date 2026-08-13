from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.transactions.schemas.transaction import TransactionCreate,TransactionOut
from app.modules.transactions.services.transaction_service import create_transaction
router=APIRouter()
@router.post("/",response_model=TransactionOut)
def endpoint(data:TransactionCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return create_transaction(db,data,user.id)

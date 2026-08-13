from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.transactions.schemas.transaction import VoidRequest,TransactionOut
from app.modules.transactions.services.transaction_service import void_transaction
router=APIRouter()
@router.patch("/{transaction_id}/void",response_model=TransactionOut)
def endpoint(transaction_id:int,data:VoidRequest,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return void_transaction(db,transaction_id,user.id,data.reason)

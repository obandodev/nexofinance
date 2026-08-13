from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.transfers.schemas.transfer import TransferCreate,TransferOut
from app.modules.transfers.services.transfer_service import create_transfer
router=APIRouter()
@router.post("/",response_model=TransferOut)
def endpoint(data:TransferCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return create_transfer(db,data,user.id)

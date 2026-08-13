from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.transfers.schemas.transfer import TransferOut
from app.modules.transfers.services.transfer_service import list_transfers
router=APIRouter()
@router.get("/",response_model=list[TransferOut])
def endpoint(db:Session=Depends(get_db),user:User=Depends(get_current_user)): return list_transfers(db,user.id)

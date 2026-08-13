from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.auth.schemas.user import RecoveryRequest
from app.modules.auth.services.auth_service import recover_password
router=APIRouter()
@router.post("/recover-password")
def endpoint(data:RecoveryRequest,db:Session=Depends(get_db)): return recover_password(db,data)

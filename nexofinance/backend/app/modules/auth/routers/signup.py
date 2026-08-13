from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.auth.schemas.user import SignupRequest
from app.modules.auth.services.auth_service import signup
router=APIRouter()
@router.post("/signup")
def endpoint(data:SignupRequest,db:Session=Depends(get_db)): return signup(db,data)

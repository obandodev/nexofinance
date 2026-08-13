from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.auth.schemas.user import LoginRequest,TokenResponse
from app.modules.auth.services.auth_service import login
router=APIRouter()
@router.post("/login",response_model=TokenResponse)
def endpoint(credentials:LoginRequest,db:Session=Depends(get_db)): return login(db,credentials)

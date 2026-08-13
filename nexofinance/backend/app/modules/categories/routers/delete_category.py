from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.categories.services.category_service import delete_category
router=APIRouter()
@router.delete("/{category_id}")
def endpoint(category_id: int, db: Session=Depends(get_db), user: User=Depends(get_current_user)): return delete_category(db,category_id,user.id)

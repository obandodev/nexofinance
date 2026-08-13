from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.budgets.repositories.repository import get_for_user
router=APIRouter()
@router.delete("/{budget_id}")
def endpoint(budget_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    budget=get_for_user(db,budget_id,user.id)
    if not budget: raise HTTPException(status_code=404,detail="Presupuesto no encontrado")
    db.delete(budget); db.commit(); return {"deleted":True}

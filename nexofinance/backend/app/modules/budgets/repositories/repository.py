from typing import Optional
from sqlalchemy.orm import Session
from app.modules.budgets.models.budget import Budget

def list_for_user(db: Session, user_id: int, month: Optional[str] = None):
    query = db.query(Budget).filter(Budget.user_id == user_id)
    if month:
        query = query.filter(Budget.month == month)
    return query.all()

def get_for_user(db: Session, budget_id: int, user_id: int):
    return db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user_id).first()

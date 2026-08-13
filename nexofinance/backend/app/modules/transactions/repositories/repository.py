from sqlalchemy.orm import Session
from app.modules.transactions.models.transaction import Transaction

def list_for_user(db: Session, user_id: int, **filters):
    query = db.query(Transaction).filter(Transaction.user_id == user_id)
    for field, value in filters.items():
        if value is not None:
            query = query.filter(getattr(Transaction, field) == value)
    return query.order_by(Transaction.transaction_date.desc()).all()

def get_for_user(db: Session, transaction_id: int, user_id: int):
    return db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == user_id).first()

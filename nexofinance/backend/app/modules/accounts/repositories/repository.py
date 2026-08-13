from sqlalchemy.orm import Session
from app.modules.accounts.models.account import Account

def list_for_user(db: Session, user_id: int):
    return db.query(Account).filter(Account.user_id == user_id).order_by(Account.id.desc()).all()

def get_for_user(db: Session, account_id: int, user_id: int):
    return db.query(Account).filter(Account.id == account_id, Account.user_id == user_id).first()

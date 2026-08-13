from sqlalchemy import func
from sqlalchemy.orm import Session
from app.modules.accounts.models.account import Account
from app.modules.transactions.models.transaction import Transaction
from app.modules.categories.models.category import Category

def active_balance(db: Session, user_id: int):
    return db.query(func.coalesce(func.sum(Account.balance), 0)).filter(Account.user_id == user_id, Account.status == "ACTIVE").scalar()

def monthly_totals(db: Session, user_id: int, month: str):
    income = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == user_id, Transaction.transaction_type == "income",
        Transaction.is_voided == 0, func.to_char(Transaction.transaction_date, "YYYY-MM") == month
    ).scalar()
    expense = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == user_id, Transaction.transaction_type == "expense",
        Transaction.is_voided == 0, func.to_char(Transaction.transaction_date, "YYYY-MM") == month
    ).scalar()
    return float(income), float(expense)

def expenses_by_category(db: Session, user_id: int, month: str):
    return db.query(Category.name, func.sum(Transaction.amount)).join(
        Transaction, Transaction.category_id == Category.id
    ).filter(
        Transaction.user_id == user_id, Transaction.transaction_type == "expense",
        Transaction.is_voided == 0, func.to_char(Transaction.transaction_date, "YYYY-MM") == month
    ).group_by(Category.name).all()

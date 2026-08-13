from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.modules.accounts.models.account import Account
from app.modules.transactions.models.transaction import Transaction
from app.modules.transactions.schemas.transaction import TransactionCreate


def create_transaction(db: Session, data: TransactionCreate, user_id: int) -> Transaction:
    """
    Crea una transacción y actualiza automáticamente
    el saldo de la cuenta.
    """
    account = (
        db.query(Account)
        .filter(
            Account.id == data.account_id,
            Account.user_id == user_id,
        )
        .first()
    )
    if not account:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada.")
    if account.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="La cuenta se encuentra desactivada.")
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="El valor de la transacción debe ser mayor que cero.")
    if data.transaction_type == "expense" and account.balance < data.amount:
        raise HTTPException(status_code=400, detail="Saldo insuficiente en la cuenta.")

    if data.transaction_type == "income":
        account.balance += data.amount
    elif data.transaction_type == "expense":
        account.balance -= data.amount
    else:
        raise HTTPException(status_code=400, detail="Tipo de transacción inválido.")

    transaction = Transaction(**data.model_dump(), user_id=user_id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def void_transaction(db: Session, transaction_id: int, user_id: int, reason: str = None) -> Transaction:
    """
    Anula una transacción: revierte su efecto sobre el saldo y la marca como anulada,
    sin borrarla nunca. Queda visible en el historial con su motivo y fecha de anulación.
    """
    transaction = (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id, Transaction.user_id == user_id)
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transacción no encontrada.")

    if transaction.is_voided:
        raise HTTPException(status_code=400, detail="Esta transacción ya fue anulada anteriormente.")

    account = db.query(Account).filter(Account.id == transaction.account_id).first()
    if account:
        if transaction.transaction_type == "income":
            account.balance -= transaction.amount
        else:
            account.balance += transaction.amount

    transaction.is_voided = 1
    transaction.voided_at = datetime.utcnow()
    transaction.void_reason = reason

    db.commit()
    db.refresh(transaction)
    return transaction


def get_transactions(
    db: Session,
    user_id: int,
    account_id=None,
    category_id=None,
    transaction_type=None,
    date_from=None,
    date_to=None,
    search=None,
):
    """Devuelve TODAS las transacciones del usuario (incluidas las anuladas), con filtros opcionales."""
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if account_id:
        query = query.filter(Transaction.account_id == account_id)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)
    if date_from:
        query = query.filter(Transaction.transaction_date >= date_from)
    if date_to:
        query = query.filter(Transaction.transaction_date <= date_to)
    if search:
        query = query.filter(Transaction.note.ilike(f"%{search}%"))

    return query.order_by(Transaction.transaction_date.desc()).all()
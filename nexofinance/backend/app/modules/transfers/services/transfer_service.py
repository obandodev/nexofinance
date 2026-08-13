from fastapi import HTTPException
from app.modules.accounts.models.account import Account
from app.modules.transfers.models.transfer import Transfer
from app.modules.transfers.repositories.repository import list_for_user
from app.modules.transfers.validators import validate_transfer

def list_transfers(db, user_id): return list_for_user(db, user_id)

def create_transfer(db, data, user_id):
    validate_transfer(data)
    from_account = db.query(Account).filter(Account.id == data.from_account_id, Account.user_id == user_id).first()
    to_account = db.query(Account).filter(Account.id == data.to_account_id, Account.user_id == user_id).first()
    if not from_account or not to_account: raise HTTPException(status_code=404, detail="Una de las cuentas no fue encontrada")
    if from_account.status != "ACTIVE" or to_account.status != "ACTIVE": raise HTTPException(status_code=400, detail="Las cuentas deben estar activas")
    if from_account.balance < data.amount: raise HTTPException(status_code=400, detail="Saldo insuficiente en la cuenta origen")
    from_account.balance -= data.amount; to_account.balance += data.amount
    transfer = Transfer(**data.model_dump(), user_id=user_id)
    db.add(transfer); db.commit(); db.refresh(transfer); return transfer

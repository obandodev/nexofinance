from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.modules.accounts.models.account import Account
from app.modules.accounts.repositories.repository import list_for_user, get_for_user
from app.modules.accounts.validators import validate_active, validate_zero_balance

def list_accounts(db, user_id):
    return list_for_user(db, user_id)

def create_account(db, data, user_id):
    account = Account(user_id=user_id, name=data.name, account_type=data.account_type,
                     currency=data.currency, balance=data.balance, status="ACTIVE")
    db.add(account); db.commit(); db.refresh(account)
    return account

def update_account(db, account_id, data, user_id):
    account = get_for_user(db, account_id, user_id)
    if not account:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada.")
    if data.name is not None: account.name = data.name
    if data.account_type is not None: account.account_type = data.account_type
    db.commit(); db.refresh(account)
    return account

def deactivate_account(db, account_id, user_id):
    account = get_for_user(db, account_id, user_id)
    if not account: raise HTTPException(status_code=404, detail="Cuenta no encontrada.")
    if account.status == "INACTIVE": raise HTTPException(status_code=400, detail="La cuenta ya se encuentra desactivada.")
    validate_zero_balance(account)
    account.status = "INACTIVE"
    db.commit(); db.refresh(account)
    return account

def activate_account(db, account_id, user_id):
    account = get_for_user(db, account_id, user_id)
    if not account: raise HTTPException(status_code=404, detail="Cuenta no encontrada.")
    if account.status == "ACTIVE": raise HTTPException(status_code=400, detail="La cuenta ya está activa.")
    account.status = "ACTIVE"
    db.commit(); db.refresh(account)
    return account

from fastapi import HTTPException
def validate_active(account):
    if account.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="La cuenta se encuentra desactivada.")
def validate_zero_balance(account):
    if account.balance != 0:
        raise HTTPException(status_code=400, detail="La cuenta debe tener saldo $0 para poder desactivarse.")

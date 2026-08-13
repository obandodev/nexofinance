from fastapi import HTTPException
def validate_transfer(data):
    if data.from_account_id == data.to_account_id:
        raise HTTPException(status_code=400, detail="La cuenta origen y destino no pueden ser la misma")
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor que cero.")

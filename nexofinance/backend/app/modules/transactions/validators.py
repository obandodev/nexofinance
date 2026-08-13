from fastapi import HTTPException
def validate_amount(amount):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="El valor de la transacción debe ser mayor que cero.")

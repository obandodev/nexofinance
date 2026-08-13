from fastapi import HTTPException


def validate_payment_amount(amount: float):
    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="El monto del pago debe ser mayor que cero.",
        )
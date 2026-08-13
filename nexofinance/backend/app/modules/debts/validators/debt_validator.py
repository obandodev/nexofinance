from fastapi import HTTPException


VALID_DEBT_TYPES = {
    "debt",
    "loan",
}


def validate_debt_type(debt_type: str):
    if debt_type not in VALID_DEBT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="El tipo de deuda debe ser 'debt' o 'loan'.",
        )


def validate_total_amount(amount: float):
    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="El monto total debe ser mayor que cero.",
        )
from fastapi import HTTPException
def validate_available(already_budgeted, amount, available):
    if already_budgeted + amount > available:
        remaining = available - already_budgeted
        raise HTTPException(status_code=400, detail=f"No podés presupuestar más de lo que tenés disponible. Te quedan {remaining:,.0f} sin asignar.")

from fastapi import HTTPException
def validate_goal_amount(goal, amount):
    if goal.current_amount + amount > goal.target_amount:
        raise HTTPException(status_code=400, detail="El aporte supera el monto restante de la meta.")
def validate_active_goal(goal):
    if goal.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="La meta de ahorro no está activa.")

from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.modules.accounts.models.account import Account
from app.modules.savings.models.savings_goal import SavingsGoal
from app.modules.savings.models.savings_contribution import SavingsContribution
from app.modules.savings.repositories.repository import list_goals, get_goal, list_contributions, get_contribution

def get_goals(db, user_id): return list_goals(db, user_id)

def create_goal(db, data, user_id):
    goal = SavingsGoal(name=data.name, target_amount=data.target_amount, current_amount=0,
                       target_date=data.target_date, user_id=user_id, status="ACTIVE")
    db.add(goal); db.commit(); db.refresh(goal); return goal

def update_goal(db, goal_id, data, user_id):
    goal = get_goal(db, goal_id, user_id)
    if not goal: raise HTTPException(status_code=404, detail="Meta no encontrada.")
    if goal.status != "ACTIVE": raise HTTPException(status_code=400, detail="La meta se encuentra cancelada.")
    if data.target_amount is not None and data.target_amount < goal.current_amount:
        raise HTTPException(status_code=400, detail="El monto objetivo no puede ser menor al ahorro actual.")
    for field, value in data.model_dump(exclude_unset=True).items(): setattr(goal, field, value)
    db.commit(); db.refresh(goal); return goal

def cancel_goal(db, goal_id, user_id):
    goal = get_goal(db, goal_id, user_id)
    if not goal: raise HTTPException(status_code=404, detail="Meta no encontrada.")
    if goal.status != "ACTIVE": raise HTTPException(status_code=400, detail="La meta ya se encuentra cancelada.")
    active = db.query(SavingsContribution).filter(
        SavingsContribution.goal_id == goal.id,
        SavingsContribution.user_id == user_id,
        SavingsContribution.status == "ACTIVE",
    ).count()
    if active:
        raise HTTPException(status_code=400, detail="No puedes cancelar una meta que tiene aportes activos.")
    goal.status = "CANCELLED"; db.commit(); db.refresh(goal); return goal

def add_contribution(db, goal_id, data, user_id):
    goal = get_goal(db, goal_id, user_id)
    if not goal: raise HTTPException(status_code=404, detail="Meta de ahorro no encontrada.")
    if goal.status != "ACTIVE": raise HTTPException(status_code=400, detail="No puedes aportar a una meta cancelada.")
    account = db.query(Account).filter(Account.id == data.account_id, Account.user_id == user_id).first()
    if not account: raise HTTPException(status_code=404, detail="Cuenta no encontrada.")
    if account.status != "ACTIVE": raise HTTPException(status_code=400, detail="La cuenta se encuentra desactivada.")
    if account.balance < data.amount: raise HTTPException(status_code=400, detail="Saldo insuficiente en la cuenta.")
    remaining = goal.target_amount - goal.current_amount
    if data.amount > remaining:
        raise HTTPException(status_code=400, detail=f"El aporte supera el monto restante de la meta. Solo puedes aportar hasta {remaining:.0f}.")
    account.balance -= data.amount; goal.current_amount += data.amount
    contribution = SavingsContribution(user_id=user_id, goal_id=goal.id, account_id=account.id,
                                        amount=data.amount, contribution_date=data.contribution_date, status="ACTIVE")
    db.add(contribution)
    try:
        db.commit()
    except Exception:
        db.rollback(); raise HTTPException(status_code=500, detail="No se pudo registrar el aporte a la meta.")
    db.refresh(contribution); return contribution

def get_goal_contributions(db, goal_id, user_id):
    if not get_goal(db, goal_id, user_id):
        raise HTTPException(status_code=404, detail="Meta de ahorro no encontrada.")
    return list_contributions(db, goal_id, user_id)

def update_contribution(db, contribution_id, data, user_id):
    contribution = get_contribution(db, contribution_id, user_id)
    if not contribution: raise HTTPException(status_code=404, detail="Aporte no encontrado.")
    if contribution.status != "ACTIVE": raise HTTPException(status_code=400, detail="No puedes editar un aporte anulado.")
    goal = get_goal(db, contribution.goal_id, user_id)
    if not goal: raise HTTPException(status_code=404, detail="Meta de ahorro no encontrada.")
    if goal.status != "ACTIVE": raise HTTPException(status_code=400, detail="No puedes editar aportes de una meta cancelada.")
    new_amount = data.amount if data.amount is not None else contribution.amount
    new_account_id = data.account_id if data.account_id is not None else contribution.account_id
    old_account = db.query(Account).filter(Account.id == contribution.account_id, Account.user_id == user_id).first()
    new_account = db.query(Account).filter(Account.id == new_account_id, Account.user_id == user_id).first()
    if not old_account: raise HTTPException(status_code=404, detail="La cuenta original del aporte no existe.")
    if not new_account: raise HTTPException(status_code=404, detail="La nueva cuenta no existe.")
    if new_account.status != "ACTIVE": raise HTTPException(status_code=400, detail="La nueva cuenta se encuentra desactivada.")
    new_goal_amount = goal.current_amount - contribution.amount + new_amount
    if new_goal_amount > goal.target_amount:
        raise HTTPException(status_code=400, detail="El nuevo aporte supera el monto objetivo de la meta.")
    if old_account.id == new_account.id:
        available = old_account.balance + contribution.amount
        if available < new_amount: raise HTTPException(status_code=400, detail="Saldo insuficiente en la cuenta.")
        old_account.balance = available - new_amount
    else:
        old_account.balance += contribution.amount
        if new_account.balance < new_amount: raise HTTPException(status_code=400, detail="Saldo insuficiente en la nueva cuenta.")
        new_account.balance -= new_amount
    goal.current_amount = new_goal_amount
    contribution.account_id = new_account.id; contribution.amount = new_amount
    if data.contribution_date is not None: contribution.contribution_date = data.contribution_date
    try:
        db.commit()
    except Exception:
        db.rollback(); raise HTTPException(status_code=500, detail="No se pudo actualizar el aporte.")
    db.refresh(contribution); return contribution

def cancel_contribution(db, contribution_id, user_id):
    contribution = get_contribution(db, contribution_id, user_id)
    if not contribution: raise HTTPException(status_code=404, detail="Aporte no encontrado.")
    if contribution.status != "ACTIVE": raise HTTPException(status_code=400, detail="El aporte ya se encuentra anulado.")
    goal = get_goal(db, contribution.goal_id, user_id)
    if not goal: raise HTTPException(status_code=404, detail="Meta de ahorro no encontrada.")
    account = db.query(Account).filter(Account.id == contribution.account_id, Account.user_id == user_id).first()
    if not account: raise HTTPException(status_code=404, detail="La cuenta asociada al aporte no existe.")
    account.balance += contribution.amount; goal.current_amount -= contribution.amount; contribution.status = "CANCELLED"
    try:
        db.commit()
    except Exception:
        db.rollback(); raise HTTPException(status_code=500, detail="No se pudo anular el aporte.")
    db.refresh(contribution); return contribution

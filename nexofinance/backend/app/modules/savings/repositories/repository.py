from sqlalchemy.orm import Session
from app.modules.savings.models.savings_goal import SavingsGoal
from app.modules.savings.models.savings_contribution import SavingsContribution

def list_goals(db: Session, user_id: int):
    return db.query(SavingsGoal).filter(SavingsGoal.user_id == user_id).all()

def get_goal(db: Session, goal_id: int, user_id: int):
    return db.query(SavingsGoal).filter(SavingsGoal.id == goal_id, SavingsGoal.user_id == user_id).first()

def list_contributions(db: Session, goal_id: int, user_id: int):
    return db.query(SavingsContribution).filter(
        SavingsContribution.goal_id == goal_id,
        SavingsContribution.user_id == user_id,
    ).order_by(SavingsContribution.contribution_date.desc()).all()

def get_contribution(db: Session, contribution_id: int, user_id: int):
    return db.query(SavingsContribution).filter(
        SavingsContribution.id == contribution_id,
        SavingsContribution.user_id == user_id,
    ).first()

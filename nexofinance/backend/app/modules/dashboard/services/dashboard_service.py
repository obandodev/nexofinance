from datetime import date
from app.modules.dashboard.repositories.repository import active_balance, monthly_totals, expenses_by_category
from app.modules.dashboard.schemas.dashboard import DashboardSummary, ExpenseByCategory

def get_summary(db,user_id):
    month=date.today().strftime("%Y-%m"); income,expense=monthly_totals(db,user_id,month)
    return DashboardSummary(total_balance=float(active_balance(db,user_id)),total_income_month=income,total_expense_month=expense,net_month=income-expense)

def get_expenses_by_category(db,user_id,month):
    return [ExpenseByCategory(category_name=r[0],total=float(r[1])) for r in expenses_by_category(db,user_id,month)]

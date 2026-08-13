from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_balance: float
    total_income_month: float
    total_expense_month: float
    net_month: float


class ExpenseByCategory(BaseModel):
    category_name: str
    total: float


class MonthlyTrend(BaseModel):
    month: str
    income: float
    expense: float

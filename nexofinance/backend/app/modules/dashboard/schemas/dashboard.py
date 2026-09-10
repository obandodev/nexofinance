from typing import Optional
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
    net: float
    is_deficit: bool


class CategoryShare(BaseModel):
    category_name: str
    total: float
    percentage: float


class BudgetAlert(BaseModel):
    category_name: str
    limit_amount: float
    spent_amount: float
    overspent_by: float


class DebtLoad(BaseModel):
    total_pending_debt: float
    total_pending_loan: float
    debt_to_income_ratio: Optional[float] = None


class FinancialInsights(BaseModel):
    monthly_trend: list[MonthlyTrend]
    savings_rate_month: Optional[float] = None
    deficit_months_count: int
    top_expense_categories: list[CategoryShare]
    budget_alerts: list[BudgetAlert]
    debt_load: DebtLoad
    total_saved_month: float
    total_debt_paid_month: float
    tips: list[str]
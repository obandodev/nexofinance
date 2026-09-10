from app.modules.budgets.services.budget_service import get_budget_progress

from app.modules.dashboard.repositories.repository import (
    active_balance,
    monthly_totals,
    expenses_by_category,
    last_n_months,
    pending_debt_totals,
    total_saved_month,
    total_debt_paid_month,
)

from app.modules.dashboard.schemas.dashboard import (
    DashboardSummary,
    ExpenseByCategory,
    MonthlyTrend,
    CategoryShare,
    BudgetAlert,
    DebtLoad,
    FinancialInsights,
)


def get_summary(db, user_id):
    from datetime import date
    month = date.today().strftime("%Y-%m")
    income, expense = monthly_totals(db, user_id, month)
    return DashboardSummary(
        total_balance=float(active_balance(db, user_id)),
        total_income_month=income,
        total_expense_month=expense,
        net_month=income - expense,
    )


def get_expenses_by_category(db, user_id, month):
    return [
        ExpenseByCategory(category_name=r[0], total=float(r[1]))
        for r in expenses_by_category(db, user_id, month)
    ]


def get_insights(db, user_id) -> FinancialInsights:
    months = last_n_months(6)

    trend = []
    deficit_months = 0

    for month in months:
        income, expense = monthly_totals(db, user_id, month)
        net = income - expense
        is_deficit = net < 0

        if is_deficit:
            deficit_months += 1

        trend.append(
            MonthlyTrend(
                month=month,
                income=income,
                expense=expense,
                net=net,
                is_deficit=is_deficit,
            )
        )

    current = trend[-1]
    current_month = current.month

    savings_rate = (
        (current.net / current.income) * 100
        if current.income > 0
        else None
    )

    raw_categories = expenses_by_category(db, user_id, current_month)
    total_expense = current.expense

    top_categories = []
    for name, total in sorted(raw_categories, key=lambda r: -r[1])[:3]:
        percentage = (
            (float(total) / total_expense) * 100
            if total_expense > 0
            else 0
        )
        top_categories.append(
            CategoryShare(
                category_name=name,
                total=float(total),
                percentage=percentage,
            )
        )

    progress = get_budget_progress(db, user_id, current_month)
    budget_alerts = [
        BudgetAlert(
            category_name=p.category_name,
            limit_amount=p.limit_amount,
            spent_amount=p.spent_amount,
            overspent_by=-p.remaining_amount,
        )
        for p in progress
        if p.remaining_amount < 0
    ]

    total_debt, total_loan = pending_debt_totals(db, user_id)
    debt_ratio = (
        total_debt / current.income
        if current.income > 0
        else None
    )

    debt_load = DebtLoad(
        total_pending_debt=total_debt,
        total_pending_loan=total_loan,
        debt_to_income_ratio=debt_ratio,
    )

    saved_month = total_saved_month(db, user_id, current_month)
    debt_paid_month = total_debt_paid_month(db, user_id, current_month)

    tips = _build_tips(
        current,
        deficit_months,
        top_categories,
        budget_alerts,
        debt_load,
        saved_month,
        debt_paid_month,
    )

    return FinancialInsights(
        monthly_trend=trend,
        savings_rate_month=savings_rate,
        deficit_months_count=deficit_months,
        top_expense_categories=top_categories,
        budget_alerts=budget_alerts,
        debt_load=debt_load,
        total_saved_month=saved_month,
        total_debt_paid_month=debt_paid_month,
        tips=tips,
    )


def _build_tips(
    current,
    deficit_months,
    top_categories,
    budget_alerts,
    debt_load,
    saved_month,
    debt_paid_month,
):
    tips = []

    if current.net < 0:
        tips.append(
            "Este mes tus gastos superaron tus ingresos. Revisa qué "
            "categorías puedes recortar antes de que termine el mes."
        )

    if deficit_months >= 3:
        tips.append(
            f"Llevas {deficit_months} de los últimos 6 meses en déficit "
            "(gastando más de lo que ingresa). Vale la pena revisar tus "
            "gastos fijos."
        )

    if current.income > 0:
        rate = (current.net / current.income) * 100

        if 0 <= rate < 10:
            tips.append(
                "Tu tasa de ahorro este mes es menor al 10% de tus "
                "ingresos. Intenta apartar al menos un 10-20% antes de "
                "gastar en lo demás."
            )
        elif rate >= 20:
            tips.append(
                "Buen trabajo: estás ahorrando más del 20% de tus "
                "ingresos este mes."
            )

    if top_categories:
        leader = top_categories[0]

        if leader.percentage >= 40:
            tips.append(
                f"'{leader.category_name}' concentra el "
                f"{leader.percentage:.0f}% de tus gastos del mes. Es tu "
                "categoría con mayor peso — revisa si hay margen para "
                "reducirla."
            )

    for alert in budget_alerts:
        tips.append(
            f"Te pasaste del presupuesto de '{alert.category_name}' por "
            f"{alert.overspent_by:,.0f}."
        )

    if (
        debt_load.debt_to_income_ratio is not None
        and debt_load.debt_to_income_ratio > 0.5
    ):
        tips.append(
            "Tu deuda pendiente supera la mitad de tus ingresos "
            "mensuales. Prioriza abonar a las deudas con mayor monto "
            "antes de asumir compromisos nuevos."
        )

    if saved_month > 0 or debt_paid_month > 0:
        partes = []
        if saved_month > 0:
            partes.append(f"ahorraste {saved_month:,.0f}")
        if debt_paid_month > 0:
            partes.append(f"abonaste {debt_paid_month:,.0f} a deudas")

        tips.append(
            "Además de tus gastos normales, este mes " + " y ".join(partes) +
            ". Ese dinero no cuenta como gasto porque sigue siendo tuyo "
            "o reduce lo que debes — es progreso real, no consumo."
        )

    if not tips:
        tips.append("Tus finanzas se ven equilibradas este mes. Sigue así.")

    return tips
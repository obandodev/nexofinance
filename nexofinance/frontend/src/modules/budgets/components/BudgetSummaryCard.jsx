function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function BudgetSummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="budget-summary">
      <div className="budget-summary__item">
        <span className="budget-summary__label">Saldo total en tus cuentas</span>
        <span className="budget-summary__value">
          {formatCurrency(summary.available_balance)}
        </span>
      </div>

      <div className="budget-summary__item">
        <span className="budget-summary__label">Ya asignado a presupuestos</span>
        <span className="budget-summary__value">
          {formatCurrency(summary.total_budgeted)}
        </span>
      </div>

      <div className="budget-summary__item">
        <span className="budget-summary__label">Libre para presupuestar</span>
        <span
          className={`budget-summary__value ${
            summary.unallocated < 0 ? "budget-bar__over" : ""
          }`}
        >
          {formatCurrency(summary.unallocated)}
        </span>
      </div>
    </div>
  );
}

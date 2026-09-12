function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function OverBudgetAlert({ categories }) {
  if (categories.length === 0) return null;

  return (
    <div className="budget-alert">
      <span className="budget-alert__icon">⚠</span>
      <div>
        <strong>
          Te pasaste del presupuesto en {categories.length}{" "}
          {categories.length === 1 ? "categoría" : "categorías"}:
        </strong>
        <ul className="budget-alert__list">
          {categories.map((p) => (
            <li key={p.id}>
              {p.category_name}: {formatCurrency(p.spent_amount)} de{" "}
              {formatCurrency(p.limit_amount)} presupuestados (
              {formatCurrency(p.spent_amount - p.limit_amount)} de más)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

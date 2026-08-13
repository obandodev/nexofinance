import { formatCurrency } from "../utils/formatCurrency";

export default function DebtSummary({ debts }) {
  const debtsToPay = debts
    .filter((debt) => debt.debt_type === "debt")
    .reduce(
      (total, debt) =>
        total + Math.max(debt.total_amount - debt.paid_amount, 0),
      0
    );

  const loansToCollect = debts
    .filter((debt) => debt.debt_type === "loan")
    .reduce(
      (total, debt) =>
        total + Math.max(debt.total_amount - debt.paid_amount, 0),
      0
    );

  const completed = debts.filter(
    (debt) => debt.paid_amount >= debt.total_amount
  ).length;

  return (
    <div className="debt-summary">
      <div className="debt-summary__card">
        <span className="debt-summary__label">
          Total que debo
        </span>

        <strong className="debt-summary__value">
          {formatCurrency(debtsToPay)}
        </strong>
      </div>

      <div className="debt-summary__card">
        <span className="debt-summary__label">
          Total que me deben
        </span>

        <strong className="debt-summary__value">
          {formatCurrency(loansToCollect)}
        </strong>
      </div>

      <div className="debt-summary__card">
        <span className="debt-summary__label">
          Deudas completadas
        </span>

        <strong className="debt-summary__value">
          {completed}
        </strong>
      </div>
    </div>
  );
}
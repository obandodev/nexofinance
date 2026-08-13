import { formatCurrency } from "../utils/formatCurrency";

export default function DebtCard({
  debt,
  onPayment,
  onViewPayments,
}) {
  const total = Number(debt.total_amount || 0);
  const paid = Number(debt.paid_amount || 0);

  const remaining = Math.max(total - paid, 0);

  const percent =
    total > 0
      ? Math.min((paid / total) * 100, 100)
      : 0;

  const isLoan = debt.debt_type === "loan";
  const completed = remaining === 0;

  return (
    <article className="debt-card">
      <div className="debt-card__header">
        <div>
          <h3 className="debt-card__title">
            {debt.name}
          </h3>

          <span
            className={`debt-card__type ${
              isLoan
                ? "debt-card__type--loan"
                : "debt-card__type--debt"
            }`}
          >
            {isLoan ? "Me deben" : "Yo debo"}
          </span>
        </div>

        <strong className="debt-card__remaining">
          {formatCurrency(remaining)}
        </strong>
      </div>

      <div className="debt-card__progress">
        <div className="debt-card__progress-info">
          <span>
            Pagado
          </span>

          <span>
            {formatCurrency(paid)} de {formatCurrency(total)}
          </span>
        </div>

        <div className="debt-card__track">
          <div
            className="debt-card__fill"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        <span className="debt-card__percentage">
          {Math.round(percent)}%
        </span>
      </div>

      <div className="debt-card__actions">
        {!completed && (
          <button
            type="button"
            className="form-submit"
            onClick={() => onPayment(debt)}
          >
            {isLoan ? "Registrar cobro" : "Registrar pago"}
          </button>
        )}

        <button
          type="button"
          className="debt-card__secondary-button"
          onClick={() => onViewPayments(debt)}
        >
          Ver movimientos
        </button>
      </div>

      {completed && (
        <div className="debt-card__completed">
          Deuda completada
        </div>
      )}
    </article>
  );
}
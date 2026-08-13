import { useCountUp } from "../hooks/useCountUp";
import "./BalanceCard.css";

function formatCurrency(value) {
  return value.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

export default function BalanceCard({ total, income, expense }) {
  const animatedTotal = useCountUp(total);

  return (
    <div className="balance-card">
      <div className="balance-card__glow" />
      <span className="balance-card__label">Saldo total</span>
      <span className="balance-card__value">{formatCurrency(animatedTotal)}</span>

      <div className="balance-card__row">
        <div className="balance-card__stat">
          <span className="balance-card__stat-dot balance-card__stat-dot--income" />
          <span className="balance-card__stat-label">Ingresos del mes</span>
          <span className="balance-card__stat-value">{formatCurrency(income)}</span>
        </div>
        <div className="balance-card__stat">
          <span className="balance-card__stat-dot balance-card__stat-dot--expense" />
          <span className="balance-card__stat-label">Gastos del mes</span>
          <span className="balance-card__stat-value">{formatCurrency(expense)}</span>
        </div>
      </div>
    </div>
  );
}

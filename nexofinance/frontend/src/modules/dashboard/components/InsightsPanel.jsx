import { AlertTriangle, Lightbulb, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function InsightsPanel({ insights }) {
  if (!insights) return null;

  const {
    monthly_trend,
    savings_rate_month,
    deficit_months_count,
    top_expense_categories,
    budget_alerts,
    debt_load,
    total_saved_month,
    total_debt_paid_month,
    tips,
  } = insights;

  const current = monthly_trend[monthly_trend.length - 1];

  return (
    <div className="insights-panel">
      <div className="insights-panel__stats">
        <div
          className={`insights-panel__stat ${
            current.is_deficit
              ? "insights-panel__stat--negative"
              : "insights-panel__stat--positive"
          }`}
        >
          {current.is_deficit ? (
            <TrendingDown size={20} />
          ) : (
            <TrendingUp size={20} />
          )}

          <div>
            <span className="insights-panel__stat-label">
              Neto de este mes
            </span>
            <strong className="insights-panel__stat-value">
              {formatCurrency(current.net)}
            </strong>
          </div>
        </div>

        <div className="insights-panel__stat">
          <div>
            <span className="insights-panel__stat-label">
              Tasa de ahorro
            </span>
            <strong className="insights-panel__stat-value">
              {savings_rate_month !== null
                ? `${savings_rate_month.toFixed(0)}%`
                : "—"}
            </strong>
          </div>
        </div>

        <div className="insights-panel__stat">
          <div>
            <span className="insights-panel__stat-label">
              Meses en déficit (últimos 6)
            </span>
            <strong className="insights-panel__stat-value">
              {deficit_months_count} / 6
            </strong>
          </div>
        </div>
      </div>

      {(total_saved_month > 0 || total_debt_paid_month > 0) && (
        <div className="insights-panel__progress">
          <span className="insights-panel__section-label">
            <PiggyBank size={16} /> Progreso real este mes (no cuenta como gasto)
          </span>

          <div className="insights-panel__progress-row">
            <span>Aportado a metas de ahorro</span>
            <strong>{formatCurrency(total_saved_month)}</strong>
          </div>

          <div className="insights-panel__progress-row">
            <span>Abonado a deudas propias</span>
            <strong>{formatCurrency(total_debt_paid_month)}</strong>
          </div>
        </div>
      )}

      <div className="insights-panel__trend">
        <span className="insights-panel__section-label">
          Tendencia (últimos 6 meses)
        </span>

        <div className="insights-panel__trend-bars">
          {monthly_trend.map((item) => (
            <div key={item.month} className="insights-panel__trend-bar">
              <div className="insights-panel__trend-track">
                <div
                  className={`insights-panel__trend-fill ${
                    item.is_deficit
                      ? "insights-panel__trend-fill--negative"
                      : ""
                  }`}
                  style={{
                    height: `${Math.min(
                      (Math.abs(item.net) /
                        Math.max(
                          ...monthly_trend.map((m) => Math.abs(m.net) || 1)
                        )) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="insights-panel__trend-label">
                {item.month.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {top_expense_categories.length > 0 && (
        <div className="insights-panel__categories">
          <span className="insights-panel__section-label">
            Dónde se va tu dinero este mes
          </span>

          {top_expense_categories.map((cat) => (
            <div key={cat.category_name} className="insights-panel__category-row">
              <span>{cat.category_name}</span>
              <div className="insights-panel__category-track">
                <div
                  className="insights-panel__category-fill"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <span className="insights-panel__category-value">
                {cat.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {budget_alerts.length > 0 && (
        <div className="insights-panel__alerts">
          {budget_alerts.map((alert) => (
            <div key={alert.category_name} className="insights-panel__alert">
              <AlertTriangle size={16} />
              <span>
                Te pasaste de tu presupuesto de <strong>{alert.category_name}</strong> por{" "}
                {formatCurrency(alert.overspent_by)}.
              </span>
            </div>
          ))}
        </div>
      )}

      {(debt_load.total_pending_debt > 0 || debt_load.total_pending_loan > 0) && (
        <div className="insights-panel__debt">
          <span className="insights-panel__section-label">
            Deudas y préstamos
          </span>
          <div className="insights-panel__debt-row">
            <span>Debes</span>
            <strong>{formatCurrency(debt_load.total_pending_debt)}</strong>
          </div>
          <div className="insights-panel__debt-row">
            <span>Te deben</span>
            <strong>{formatCurrency(debt_load.total_pending_loan)}</strong>
          </div>
        </div>
      )}

      <div className="insights-panel__tips">
        <span className="insights-panel__section-label">
          <Lightbulb size={16} /> Tu coach financiero dice
        </span>

        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
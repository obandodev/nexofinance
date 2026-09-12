function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function TransactionsTable({ transactions, accountName, categoryName, onVoid }) {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cuenta</th>
            <th>Categoría</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Nota</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className={t.is_voided ? "data-table__voided-row" : ""}>
              <td data-label="Fecha">{t.transaction_date}</td>
              <td data-label="Cuenta">{accountName(t.account_id)}</td>
              <td data-label="Categoría">{categoryName(t.category_id)}</td>

              <td data-label="Tipo">
                <span
                  className={`tag ${
                    t.transaction_type === "income" ? "tag--income" : "tag--expense"
                  }`}
                >
                  {t.transaction_type === "income" ? "Ingreso" : "Gasto"}
                </span>
              </td>

              <td data-label="Monto">{formatCurrency(t.amount)}</td>
              <td data-label="Nota">{t.note || "—"}</td>

              <td data-label="Estado">
                {t.is_voided ? <span className="tag tag--voided">Anulada</span> : "Activa"}
              </td>

              <td data-label="Acciones" className="data-table__actions">
                {!t.is_voided && (
                  <button className="form-submit" onClick={() => onVoid(t)}>
                    Anular
                  </button>
                )}
              </td>
            </tr>
          ))}

          {transactions.length === 0 && (
            <tr>
              <td
                colSpan={8}
                style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}
              >
                No hay transacciones para estos filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function AccountsTable({ accounts, onEdit, onToggleStatus }) {
  if (accounts.length === 0) {
    return <p className="accounts__empty">Todavía no tienes cuentas registradas.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Saldo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((a) => (
            <tr key={a.id}>
              <td data-label="Nombre">{a.name}</td>
              <td data-label="Tipo">{a.account_type}</td>
              <td data-label="Saldo">{formatCurrency(a.balance)}</td>
              <td data-label="Estado">{a.status === "ACTIVE" ? "Activa" : "Inactiva"}</td>
              <td data-label="Acciones" className="data-table__actions">
                <button className="form-submit" onClick={() => onEdit(a)}>
                  Editar
                </button>
                <button className="filters-bar__clear" onClick={() => onToggleStatus(a)}>
                  {a.status === "ACTIVE" ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

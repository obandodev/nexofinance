export default function MonthSelector({ month, monthOptions, todayMonth, isCurrentOrFutureMonth, onChange }) {
  return (
    <>
      <div className="filters-bar">
        <select value={month} onChange={(e) => onChange(e.target.value)}>
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {m}
              {m === todayMonth ? " (actual)" : ""}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={month}
          onChange={(e) => onChange(e.target.value)}
          title="Buscar cualquier mes, pasado o futuro"
        />
      </div>

      <p className="budgets__hint">
        {isCurrentOrFutureMonth
          ? "Podés crear, editar o eliminar presupuestos para este mes."
          : "Estás viendo el historial de un mes anterior (solo lectura)."}
      </p>
    </>
  );
}

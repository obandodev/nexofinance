export default function TransactionFilters({ accounts, categories, filters, onChange, onClear }) {
  return (
    <div className="filters-bar">
      <select
        value={filters.account}
        onChange={(e) => onChange("account", e.target.value)}
      >
        <option value="">Todas las cuentas</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => onChange("category", e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select value={filters.type} onChange={(e) => onChange("type", e.target.value)}>
        <option value="">Ingresos y gastos</option>
        <option value="income">Solo ingresos</option>
        <option value="expense">Solo gastos</option>
      </select>

      <input
        type="date"
        value={filters.from}
        onChange={(e) => onChange("from", e.target.value)}
        title="Desde"
      />

      <input
        type="date"
        value={filters.to}
        onChange={(e) => onChange("to", e.target.value)}
        title="Hasta"
      />

      <input
        placeholder="Buscar nota..."
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
      />

      <button className="filters-bar__clear" onClick={onClear}>
        Limpiar filtros
      </button>
    </div>
  );
}

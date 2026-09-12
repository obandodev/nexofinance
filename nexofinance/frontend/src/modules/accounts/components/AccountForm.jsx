import { useState, useEffect } from "react";

const ACCOUNT_TYPES = [
  { value: "ahorros", label: "Ahorros" },
  { value: "corriente", label: "Corriente" },
  { value: "efectivo", label: "Efectivo" },
  { value: "otra", label: "Otra" },
];

export default function AccountForm({ editingAccount, onSubmit, onCancelEdit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("ahorros");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (editingAccount) {
      setName(editingAccount.name);
      setType(editingAccount.account_type);
      setBalance(editingAccount.balance);
    } else {
      setName("");
      setType("ahorros");
      setBalance("");
    }
  }, [editingAccount]);

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name,
      account_type: type,
      balance: Number(balance) || 0,
    });

    if (!editingAccount) {
      setName("");
      setType("ahorros");
      setBalance("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="account-form">
      <div className="form-row">
        <input
          placeholder="Nombre (ej: Ahorros Bancolombia)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <input
          placeholder="Saldo inicial"
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          disabled={Boolean(editingAccount)}
        />
      </div>

      <div className="account-form__actions">
        <button className="form-submit" type="submit">
          {editingAccount ? "Guardar cambios" : "Agregar cuenta"}
        </button>

        {editingAccount && (
          <button
            type="button"
            className="filters-bar__clear"
            onClick={onCancelEdit}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

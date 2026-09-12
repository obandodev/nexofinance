import { useState } from "react";

export default function TransactionForm({ accounts, categories, onSubmit }) {
  const [type, setType] = useState("expense");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const filteredCategories = categories.filter((c) => c.category_type === type);

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      account_id: Number(accountId),
      category_id: Number(categoryId),
      transaction_type: type,
      amount: Number(amount),
      note: note || null,
      transaction_date: date,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </select>

        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        >
          <option value="">Cuenta</option>

          {accounts.map((a) => (
            <option key={a.id} value={a.id} disabled={a.status !== "ACTIVE"}>
              {a.name}
              {a.status !== "ACTIVE" ? " — Inactiva" : ""}
            </option>
          ))}
        </select>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Categoría</option>

          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <input
          placeholder="Monto"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          placeholder="Nota (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <button className="form-submit" type="submit">
        Registrar
      </button>
    </form>
  );
}

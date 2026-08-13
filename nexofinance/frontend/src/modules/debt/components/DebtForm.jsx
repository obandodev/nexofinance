import { useState } from "react";

export default function DebtForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("debt");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const amount = Number(totalAmount);

    if (!name.trim()) {
      setError("Ingresa un nombre para la deuda.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("El monto debe ser mayor que cero.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        debt_type: type,
        total_amount: amount,
        due_date: dueDate || null,
      });

      setName("");
      setType("debt");
      setTotalAmount("");
      setDueDate("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "No se pudo registrar la deuda."
      );
    }
  }

  return (
    <form className="debt-form" onSubmit={handleSubmit}>
      <div className="debt-form__field">
        <label htmlFor="debt-type">
          Tipo
        </label>

        <select
          id="debt-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="debt">
            Yo debo
          </option>

          <option value="loan">
            Me deben
          </option>
        </select>
      </div>

      <div className="debt-form__field">
        <label htmlFor="debt-name">
          Nombre
        </label>

        <input
          id="debt-name"
          type="text"
          placeholder={
            type === "debt"
              ? "Ej: Tarjeta de crédito"
              : "Ej: Juan Pérez"
          }
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="debt-form__field">
        <label htmlFor="debt-amount">
          Monto total
        </label>

        <input
          id="debt-amount"
          type="number"
          min="1"
          placeholder="Ej: 1000000"
          value={totalAmount}
          onChange={(event) =>
            setTotalAmount(event.target.value)
          }
        />
      </div>

      <div className="debt-form__field">
        <label htmlFor="debt-due-date">
          Fecha límite
          <span> (opcional)</span>
        </label>

        <input
          id="debt-due-date"
          type="date"
          value={dueDate}
          onChange={(event) =>
            setDueDate(event.target.value)
          }
        />
      </div>

      {error && (
        <p className="debt-form__error">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="form-submit"
      >
        Registrar deuda
      </button>
    </form>
  );
}
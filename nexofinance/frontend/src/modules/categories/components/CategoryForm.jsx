import { useState } from "react";

export default function CategoryForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await onSubmit({ name, category_type: type });
      setName("");
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo crear la categoría");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          placeholder="Nombre (ej: Mascotas)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </select>
      </div>

      {error && (
        <p style={{ color: "var(--red)", fontSize: "var(--text-sm)" }}>{error}</p>
      )}

      <button className="form-submit" type="submit">
        Crear categoría
      </button>
    </form>
  );
}

import { useState } from "react";

export default function BudgetForm({ categories, onSubmit }) {
  const [categoryId, setCategoryId] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await onSubmit({
        category_id: Number(categoryId),
        limit_amount: Number(limitAmount),
      });
      setLimitAmount("");
      setCategoryId("");
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo crear el presupuesto");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Límite mensual"
          type="number"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          required
        />
      </div>

      {error && (
        <p style={{ color: "var(--red)", fontSize: "var(--text-sm)" }}>{error}</p>
      )}

      <button className="form-submit" type="submit">
        Guardar presupuesto
      </button>
    </form>
  );
}

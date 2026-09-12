import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

export default function EditCategoryModal({ open, category, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setError("");
    }
  }, [category]);

  async function handleSave() {
    setError("");

    try {
      await onSave(category.id, { name });
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo editar la categoría");
    }
  }

  if (!category) return null;

  return (
    <ConfirmModal
      open={open}
      title="Editar categoría"
      message={
        <>
          <input
            className="auth__input"
            style={{ width: "100%" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la categoría"
          />
          {error && (
            <p style={{ color: "var(--red)", marginTop: "0.5rem" }}>{error}</p>
          )}
        </>
      }
      confirmText="Guardar"
      cancelText="Cancelar"
      onConfirm={handleSave}
      onCancel={onCancel}
    />
  );
}

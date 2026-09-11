import { useEffect, useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import ConfirmModal from "../../../components/ConfirmModal";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/categories";
import "../../../styles/forms.css";
import "../styles/Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [error, setError] = useState("");

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  function loadCategories() {
    getCategories().then(setCategories);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createCategory({ name, category_type: type });
      setName("");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo crear la categoría");
    }
  }

  function openDeleteConfirm(category) {
    setDeleteError("");
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    try {
      await deleteCategory(categoryToDelete.id);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (err) {
      setDeleteError(err.response?.data?.detail || "No se pudo eliminar la categoría");
    }
  }

  function openEditModal(category) {
    setEditError("");
    setCategoryToEdit(category);
    setEditName(category.name);
    setShowEditModal(true);
  }

  async function handleEditSave() {
    try {
      await updateCategory(categoryToEdit.id, { name: editName });
      setShowEditModal(false);
      setCategoryToEdit(null);
      loadCategories();
    } catch (err) {
      setEditError(err.response?.data?.detail || "No se pudo editar la categoría");
    }
  }

  const expenseCategories = categories.filter((c) => c.category_type === "expense");
  const incomeCategories = categories.filter((c) => c.category_type === "income");

  function renderCategory(c) {
    const isSystem = c.user_id === null;
    return (
      <span key={c.id} className={`tag ${c.category_type === "income" ? "tag--income" : "tag--expense"}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
        {c.name} {isSystem && "· sistema"}
        {!isSystem && (
          <>
            <button
              className="filters-bar__clear"
              style={{ padding: "0.1rem 0.5rem", fontSize: "0.65rem" }}
              onClick={() => openEditModal(c)}
            >
              editar
            </button>
            <button
              className="filters-bar__clear"
              style={{ padding: "0.1rem 0.5rem", fontSize: "0.65rem" }}
              onClick={() => openDeleteConfirm(c)}
            >
              ×
            </button>
          </>
        )}
      </span>
    );
  }

  return (
    <AppLayout>
      <h1 className="dashboard__title">Categorías</h1>

      <Panel title="Crear categoría">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input placeholder="Nombre (ej: Mascotas)" value={name} onChange={(e) => setName(e.target.value)} required />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>
          </div>
          {error && <p style={{ color: "var(--red)", fontSize: "var(--text-sm)" }}>{error}</p>}
          <button className="form-submit" type="submit">Crear categoría</button>
        </form>
      </Panel>

      <Panel title="Categorías de gasto">
        <div className="filters-bar">{expenseCategories.map(renderCategory)}</div>
      </Panel>

      <Panel title="Categorías de ingreso">
        <div className="filters-bar">{incomeCategories.map(renderCategory)}</div>
      </Panel>

      {categoryToDelete && (
        <ConfirmModal
          open={showDeleteConfirm}
          title="Eliminar categoría"
          message={
            deleteError ? (
              <p style={{ color: "var(--red)" }}>{deleteError}</p>
            ) : (
              `¿Seguro que querés eliminar "${categoryToDelete.name}"?`
            )
          }
          confirmText="Eliminar"
          cancelText="Cerrar"
          onConfirm={handleDelete}
          onCancel={() => {
            setCategoryToDelete(null);
            setShowDeleteConfirm(false);
          }}
        />
      )}

      {categoryToEdit && (
        <ConfirmModal
          open={showEditModal}
          title="Editar categoría"
          message={
            <>
              <input
                className="auth__input"
                style={{ width: "100%" }}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nombre de la categoría"
              />
              {editError && (
                <p style={{ color: "var(--red)", marginTop: "0.5rem" }}>{editError}</p>
              )}
            </>
          }
          confirmText="Guardar"
          cancelText="Cancelar"
          onConfirm={handleEditSave}
          onCancel={() => {
            setCategoryToEdit(null);
            setShowEditModal(false);
          }}
        />
      )}
    </AppLayout>
  );
}
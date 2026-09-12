import { useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import ConfirmModal from "../../../components/ConfirmModal";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import EditCategoryModal from "../components/EditCategoryModal";
import useCategories from "../hooks/useCategories";
import "../../../styles/forms.css";
import "../styles/Categories.css";

export default function CategoriesPage() {
  const {
    expenseCategories,
    incomeCategories,
    addCategory,
    saveCategory,
    removeCategory,
  } = useCategories();

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [categoryToEdit, setCategoryToEdit] = useState(null);

  function openDeleteConfirm(category) {
    setDeleteError("");
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    try {
      await removeCategory(categoryToDelete.id);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    } catch (err) {
      setDeleteError(err.response?.data?.detail || "No se pudo eliminar la categoría");
    }
  }

  async function handleEditSave(id, changes) {
    await saveCategory(id, changes);
    setCategoryToEdit(null);
  }

  return (
    <AppLayout>
      <h1 className="dashboard__title">Categorías</h1>

      <Panel title="Crear categoría">
        <CategoryForm onSubmit={addCategory} />
      </Panel>

      <Panel title="Categorías de gasto">
        <CategoryList
          categories={expenseCategories}
          onEdit={setCategoryToEdit}
          onDelete={openDeleteConfirm}
        />
      </Panel>

      <Panel title="Categorías de ingreso">
        <CategoryList
          categories={incomeCategories}
          onEdit={setCategoryToEdit}
          onDelete={openDeleteConfirm}
        />
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

      <EditCategoryModal
        open={Boolean(categoryToEdit)}
        category={categoryToEdit}
        onSave={handleEditSave}
        onCancel={() => setCategoryToEdit(null)}
      />
    </AppLayout>
  );
}

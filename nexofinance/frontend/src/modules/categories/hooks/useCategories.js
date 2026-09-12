import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadCategories() {
    setLoading(true);
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function addCategory(data) {
    await createCategory(data);
    loadCategories();
  }

  async function saveCategory(id, changes) {
    await updateCategory(id, changes);
    loadCategories();
  }

  async function removeCategory(id) {
    await deleteCategory(id);
    loadCategories();
  }

  const expenseCategories = categories.filter((c) => c.category_type === "expense");
  const incomeCategories = categories.filter((c) => c.category_type === "income");

  return {
    categories,
    expenseCategories,
    incomeCategories,
    loading,
    addCategory,
    saveCategory,
    removeCategory,
  };
}

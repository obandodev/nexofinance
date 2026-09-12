import { useEffect, useState } from "react";
import { getCategories } from "../../categories/api/categories";
import {
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
  getBudgetSummary,
} from "../api/budgets";

const todayMonth = new Date().toISOString().slice(0, 7);

export function buildMonthRange() {
  const months = [];
  const [year, month] = todayMonth.split("-").map(Number);

  for (let offset = 0; offset <= 11; offset++) {
    const date = new Date(year, month - 1 + offset, 1);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
  }

  return months;
}

export { todayMonth };

export default function useBudgets() {
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const [loading, setLoading] = useState(true);

  function loadProgress(month) {
    return getBudgetProgress(month).then(setProgress);
  }

  function loadSummary(month) {
    return getBudgetSummary(month).then(setSummary);
  }

  function loadAll(month) {
    setLoading(true);
    Promise.all([loadProgress(month), loadSummary(month)]).finally(() =>
      setLoading(false)
    );
  }

  useEffect(() => {
    getCategories().then((all) =>
      setCategories(all.filter((c) => c.category_type === "expense"))
    );
  }, []);

  useEffect(() => {
    loadAll(selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  async function addBudget(data) {
    await createBudget({ ...data, month: selectedMonth });
    loadAll(selectedMonth);
  }

  async function saveBudget(id, changes) {
    await updateBudget(id, changes);
    loadAll(selectedMonth);
  }

  async function removeBudget(id) {
    await deleteBudget(id);
    loadAll(selectedMonth);
  }

  const isCurrentOrFutureMonth = selectedMonth >= todayMonth;
  const overBudgetCategories = progress.filter(
    (p) => p.spent_amount > p.limit_amount
  );

  return {
    categories,
    progress,
    summary,
    loading,
    selectedMonth,
    setSelectedMonth,
    isCurrentOrFutureMonth,
    overBudgetCategories,
    addBudget,
    saveBudget,
    removeBudget,
  };
}

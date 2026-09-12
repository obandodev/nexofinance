import { useEffect, useState } from "react";
import { getAccounts } from "../../accounts/api/accounts";
import { getCategories } from "../../categories/api/categories";
import { getBudgetProgress } from "../../budgets/api/budgets";
import {
  getTransactions,
  createTransaction,
  voidTransaction,
} from "../api/transactions";

export const PAGE_SIZE = 20;

const emptyFilters = {
  account: "",
  category: "",
  type: "",
  from: "",
  to: "",
  search: "",
};

export default function useTransactions() {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingList, setLoadingList] = useState(true);

  const [filters, setFilters] = useState(emptyFilters);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(emptyFilters);
  }

  function loadTransactions() {
    setLoadingList(true);
    return getTransactions({
      account_id: filters.account || undefined,
      category_id: filters.category || undefined,
      transaction_type: filters.type || undefined,
      date_from: filters.from || undefined,
      date_to: filters.to || undefined,
      search: filters.search || undefined,
      page,
      page_size: PAGE_SIZE,
    }).then((data) => {
      setTransactions(data.items);
      setTotal(data.total);
      setLoadingList(false);
    });
  }

  useEffect(() => {
    getAccounts().then(setAccounts);
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  // Si cambian los filtros, siempre volvemos a la pagina 1
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function checkBudgetOverrun(categoryId, amount, dateStr) {
    const month = dateStr.slice(0, 7);
    const progress = await getBudgetProgress(month);
    const matching = progress.find((p) => p.category_id === Number(categoryId));

    if (!matching) return null;

    const newSpent = matching.spent_amount + Number(amount);

    if (newSpent > matching.limit_amount) {
      return {
        categoryName: matching.category_name,
        newSpent,
        limit: matching.limit_amount,
      };
    }

    return null;
  }

  async function addTransaction(data) {
    await createTransaction(data);
    setPage(1);
    await loadTransactions();
  }

  async function voidExistingTransaction(id, reason) {
    await voidTransaction(id, reason || null);
    await loadTransactions();
  }

  function accountName(id) {
    return accounts.find((a) => a.id === id)?.name || "—";
  }

  function categoryName(id) {
    return categories.find((c) => c.id === id)?.name || "—";
  }

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return {
    accounts,
    categories,
    transactions,
    total,
    page,
    setPage,
    totalPages,
    loadingList,
    filters,
    updateFilter,
    clearFilters,
    checkBudgetOverrun,
    addTransaction,
    voidExistingTransaction,
    accountName,
    categoryName,
  };
}

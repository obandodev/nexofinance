import { useEffect, useMemo, useState } from "react";
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  cancelSavingsGoal,
  addSavingsContribution,
  getSavingsContributions,
  updateSavingsContribution,
  cancelSavingsContribution,
} from "../api/savingsGoals";
import { getAccounts } from "../../accounts/api/accounts";

export default function useSavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const activeAccounts = useMemo(
    () => accounts.filter((account) => account.status === "ACTIVE"),
    [accounts]
  );

  async function refreshGoals() {
    setGoals(await getSavingsGoals());
  }

  async function refreshAccounts() {
    setAccounts(await getAccounts());
  }

  async function refreshAll() {
    setLoading(true);
    try {
      await Promise.all([refreshGoals(), refreshAccounts()]);
    } finally {
      setLoading(false);
    }
  }

  async function refreshContributions(goalId) {
    const data = await getSavingsContributions(goalId);
    setContributions(data);
    return data;
  }

  useEffect(() => {
    refreshAll().catch((requestError) => {
      console.error(requestError);
      setError("No se pudieron cargar las metas de ahorro.");
      setLoading(false);
    });
  }, []);

  async function createGoal(data) {
    await createSavingsGoal(data);
    await refreshGoals();
  }

  async function editGoal(id, changes) {
    await updateSavingsGoal(id, changes);
    await refreshGoals();
  }

  async function cancelGoal(id) {
    await cancelSavingsGoal(id);
    await refreshGoals();
  }

  async function addContribution(goalId, data) {
    await addSavingsContribution(goalId, data);
    await Promise.all([refreshGoals(), refreshAccounts()]);
  }

  async function editContribution(id, changes, goalId) {
    await updateSavingsContribution(id, changes);
    await Promise.all([refreshGoals(), refreshAccounts(), refreshContributions(goalId)]);
  }

  async function cancelContribution(id, goalId) {
    await cancelSavingsContribution(id);
    await Promise.all([refreshGoals(), refreshAccounts(), refreshContributions(goalId)]);
  }

  function apiError(requestError, fallback) {
    return requestError?.response?.data?.detail || fallback;
  }

  return {
    goals,
    accounts,
    activeAccounts,
    contributions,
    selectedGoal,
    setSelectedGoal,
    selectedContribution,
    setSelectedContribution,
    error,
    setError,
    loading,
    refreshContributions,
    createGoal,
    editGoal,
    cancelGoal,
    addContribution,
    editContribution,
    cancelContribution,
    apiError,
  };
}

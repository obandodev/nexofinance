import { useCallback, useEffect, useState } from "react";

import {
  getDebts,
  createDebt,
  updateDebt,
  getDebtPayments,
  createDebtPayment,
} from "../api/debts";

export default function useDebts() {
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const [error, setError] = useState("");

  const loadDebts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDebts();
      setDebts(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "No se pudieron cargar las deudas."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async (debtId) => {
    try {
      setLoadingPayments(true);
      setError("");

      const data = await getDebtPayments(debtId);
      setPayments(data);

      return data;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "No se pudieron cargar los pagos."
      );

      return [];
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  const handleCreateDebt = useCallback(async (data) => {
    await createDebt(data);
    await loadDebts();
  }, [loadDebts]);

  const handleUpdateDebt = useCallback(
    async (id, changes) => {
      await updateDebt(id, changes);
      await loadDebts();
    },
    [loadDebts]
  );

  const handleCreatePayment = useCallback(
    async (debtId, data) => {
      const payment = await createDebtPayment(debtId, data);

      await loadDebts();
      await loadPayments(debtId);

      return payment;
    },
    [loadDebts, loadPayments]
  );

  useEffect(() => {
    loadDebts();
  }, [loadDebts]);

  return {
    debts,
    payments,
    loading,
    loadingPayments,
    error,

    loadDebts,
    loadPayments,

    createDebt: handleCreateDebt,
    updateDebt: handleUpdateDebt,
    createPayment: handleCreatePayment,
  };
}
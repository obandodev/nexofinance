import { useEffect, useState } from "react";
import {
  getAccounts,
  createAccount,
  updateAccount,
  activateAccount,
  deactivateAccount,
} from "../api/accounts";

export default function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadAccounts() {
    setLoading(true);
    getAccounts().then((data) => {
      setAccounts(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  async function addAccount(data) {
    await createAccount(data);
    loadAccounts();
  }

  async function editAccount(id, data) {
    await updateAccount(id, data);
    loadAccounts();
  }

  async function toggleStatus(account) {
    if (account.status === "ACTIVE") {
      await deactivateAccount(account.id);
    } else {
      await activateAccount(account.id);
    }
    loadAccounts();
  }

  return {
    accounts,
    loading,
    loadAccounts,
    addAccount,
    editAccount,
    toggleStatus,
  };
}

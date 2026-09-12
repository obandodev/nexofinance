import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import ConfirmModal from "../../../components/ConfirmModal";
import SuccessModal from "../../../components/SuccessModal";
import AccountForm from "../components/AccountForm";
import AccountsTable from "../components/AccountsTable";
import useAccounts from "../hooks/useAccounts";
import "../../../styles/forms.css";
import "../styles/Accounts.css";

export default function AccountsPage() {
  const navigate = useNavigate();
  const { accounts, loading, addAccount, editAccount, toggleStatus } = useAccounts();

  const [editingAccount, setEditingAccount] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBalanceWarning, setShowBalanceWarning] = useState(false);

  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [statusSuccessMessage, setStatusSuccessMessage] = useState("");

  async function handleFormSubmit(data) {
    if (editingAccount) {
      await editAccount(editingAccount.id, data);
      setEditingAccount(null);
    } else {
      await addAccount(data);
    }
  }

  function openStatusModal(account) {
    setSelectedAccount(account);
    setShowConfirm(true);
  }

  async function handleStatusChange() {
    if (!selectedAccount) return;

    try {
      await toggleStatus(selectedAccount);

      setStatusSuccessMessage(
        selectedAccount.status === "ACTIVE"
          ? "La cuenta fue desactivada correctamente."
          : "La cuenta fue activada correctamente."
      );
      setSelectedAccount(null);
      setShowConfirm(false);
      setShowStatusSuccess(true);
    } catch (error) {
      const message = error.response?.data?.detail || "";

      if (message.includes("saldo $0")) {
        setShowConfirm(false);
        setShowBalanceWarning(true);
        return;
      }

      setShowConfirm(false);
    }
  }

  return (
    <AppLayout>
      <h1 className="dashboard__title">Cuentas</h1>

      <Panel title={editingAccount ? "Editar cuenta" : "Agregar cuenta"}>
        <AccountForm
          editingAccount={editingAccount}
          onSubmit={handleFormSubmit}
          onCancelEdit={() => setEditingAccount(null)}
        />
      </Panel>

      <Panel title="Mis cuentas">
        {loading ? (
          <p className="accounts__empty">Cargando tus cuentas...</p>
        ) : (
          <AccountsTable
            accounts={accounts}
            onEdit={setEditingAccount}
            onToggleStatus={openStatusModal}
          />
        )}
      </Panel>

      {selectedAccount && (
        <ConfirmModal
          open={showConfirm}
          title={selectedAccount.status === "ACTIVE" ? "Desactivar cuenta" : "Activar cuenta"}
          message={
            selectedAccount.status === "ACTIVE"
              ? `¿Deseas desactivar ${selectedAccount.name}?`
              : `¿Deseas activar ${selectedAccount.name}?`
          }
          confirmText={selectedAccount.status === "ACTIVE" ? "Desactivar" : "Activar"}
          onConfirm={handleStatusChange}
          onCancel={() => {
            setSelectedAccount(null);
            setShowConfirm(false);
          }}
        />
      )}

      {showBalanceWarning && (
        <ConfirmModal
          open={showBalanceWarning}
          title="No se puede desactivar la cuenta"
          message="Esta cuenta tiene saldo disponible. Para desactivarla primero debes transferir el dinero a otra cuenta o debe registrar con saldo $0"
          confirmText="Ir a transferencias"
          cancelText="Cancelar"
          onConfirm={() => {
            setShowBalanceWarning(false);
            navigate("/transferencias");
          }}
          onCancel={() => setShowBalanceWarning(false)}
        />
      )}

      <SuccessModal
        open={showStatusSuccess}
        title="Listo"
        message={statusSuccessMessage}
        onClose={() => setShowStatusSuccess(false)}
      />
    </AppLayout>
  );
}

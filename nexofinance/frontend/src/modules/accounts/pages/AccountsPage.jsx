import { useEffect, useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import { useNavigate } from "react-router-dom";
import {
  getAccounts,
  createAccount,
  updateAccount,
  activateAccount,
  deactivateAccount,
} from "../api/accounts";
import ConfirmModal from "../../../components/ConfirmModal";
import SuccessModal from "../../../components/SuccessModal";
import "../../../styles/forms.css";
import "../styles/Accounts.css";

function formatCurrency(value) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function Accounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [statusSuccessMessage, setStatusSuccessMessage] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("ahorros");
  const [balance, setBalance] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBalanceWarning, setShowBalanceWarning] = useState(false);

  function loadAccounts() {
    getAccounts().then(setAccounts);
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await createAccount({
      name,
      account_type: type,
      balance: Number(balance) || 0,
    });

    clearForm();
    loadAccounts();
  }

  function startEdit(account) {
    setEditingId(account.id);
    setName(account.name);
    setType(account.account_type);
    setBalance(account.balance);
  }

  async function handleUpdate() {
    await updateAccount(editingId, {
      name,
      account_type: type,
      balance: Number(balance),
    });

    clearForm();
    loadAccounts();
  }

  function clearForm() {
    setEditingId(null);
    setName("");
    setType("ahorros");
    setBalance("");
  }

  function openStatusModal(account) {
    setSelectedAccount(account);
    setShowConfirm(true);
  }
  async function handleStatusChange() {
  if (!selectedAccount) return;
  try {
    if (selectedAccount.status === "ACTIVE") {
      await deactivateAccount(selectedAccount.id);
    } else {
      await activateAccount(selectedAccount.id);
    }
    setStatusSuccessMessage(
      selectedAccount.status === "ACTIVE"
        ? "La cuenta fue desactivada correctamente."
        : "La cuenta fue activada correctamente."
    );
    setSelectedAccount(null);
    setShowConfirm(false);
    setShowStatusSuccess(true);
    loadAccounts();
  } catch (error) {
    const message =
      error.response?.data?.detail || "";

    if (
      message.includes("saldo $0")
    ) {
      setShowConfirm(false);
      setShowBalanceWarning(true);
      return;
    }

    alert(message || "No se pudo cambiar el estado");
  }
}
   return (
    <AppLayout>
      <h1 className="dashboard__title">Cuentas</h1>

      <Panel title={editingId ? "Editar cuenta" : "Agregar cuenta"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (editingId) {
              handleUpdate();
            } else {
              handleSubmit(e);
            }
          }}
        >
          <div className="form-row">
            <input
              placeholder="Nombre (ej: Ahorros Bancolombia)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="ahorros">Ahorros</option>
              <option value="corriente">Corriente</option>
              <option value="efectivo">Efectivo</option>
              <option value="otra">Otra</option>
            </select>

            <input
              placeholder="Saldo inicial"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              disabled={editingId !==null}
            />
          </div>

          <button className="form-submit" type="submit">
            {editingId ? "Guardar cambios" : "Agregar cuenta"}
          </button>

          {editingId && (
            <button
              type="button"
              className="form-submit"
              onClick={clearForm}
              style={{ marginLeft: 8 }}
            >
              Cancelar
            </button>
          )}
        </form>
      </Panel>

      <Panel title="Mis cuentas">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Saldo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.account_type}</td>
                <td>{formatCurrency(a.balance)}</td>

                <td>
                  {a.status === "ACTIVE"
                    ? "Activa"
                    : "Inactiva"}
                </td>

                <td>
                  <button
                    className="form-submit"
                    style={{ marginRight: 8 }}
                    onClick={() => startEdit(a)}
                  >
                    Editar
                  </button>

                  <button
                    className="form-submit"
                    onClick={() => openStatusModal(a)}
                  >
                    {a.status === "ACTIVE"
                      ? "Desactivar"
                      : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      {selectedAccount && (
    <ConfirmModal
      open={showConfirm}
      title={
        selectedAccount.status === "ACTIVE"
          ? "Desactivar cuenta"
          : "Activar cuenta"
      }
      message={
        selectedAccount.status === "ACTIVE"
          ? `¿Deseas desactivar ${selectedAccount.name}?`
          : `¿Deseas activar ${selectedAccount.name}?`
      }
      confirmText={
        selectedAccount.status === "ACTIVE"
          ? "Desactivar"
          : "Activar"
      }
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
    onCancel={() => {
      setShowBalanceWarning(false);
    }}
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
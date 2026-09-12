import { useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import ConfirmModal from "../../../components/ConfirmModal";
import SuccessModal from "../../../components/SuccessModal";
import TransactionForm from "../components/TransactionForm";
import TransactionFilters from "../components/TransactionFilters";
import TransactionsTable from "../components/TransactionsTable";
import TransactionsPagination from "../components/TransactionsPagination";
import useTransactions from "../hooks/useTransactions";
import "../../../styles/forms.css";
import "../styles/Transactions.css";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function TransactionsPage() {
  const {
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
  } = useTransactions();

  const [formResetKey, setFormResetKey] = useState(0);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const [showVoidSuccess, setShowVoidSuccess] = useState(false);

  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [budgetWarning, setBudgetWarning] = useState(null);
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);

  const [showInactiveAccountWarning, setShowInactiveAccountWarning] = useState(false);
  const [inactiveAccountName, setInactiveAccountName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  async function actuallyCreate(transactionData) {
    try {
      await addTransaction(transactionData);
      setFormResetKey((k) => k + 1);
    } catch (error) {
      const message = error.response?.data?.detail || "";

      if (message === "La cuenta se encuentra desactivada.") {
        const account = accounts.find((a) => a.id === transactionData.account_id);
        setInactiveAccountName(account?.name || "Esta cuenta");
        setShowInactiveAccountWarning(true);
        return;
      }

      setErrorMessage(message || "No se pudo registrar la transacción.");
      setShowErrorModal(true);
    }
  }

  async function handleFormSubmit(transactionData) {
    if (transactionData.transaction_type === "expense") {
      const overrun = await checkBudgetOverrun(
        transactionData.category_id,
        transactionData.amount,
        transactionData.transaction_date
      );

      if (overrun) {
        setPendingTransaction(transactionData);
        setBudgetWarning(overrun);
        setShowBudgetWarning(true);
        return;
      }
    }

    await actuallyCreate(transactionData);
  }

  async function handleConfirmOverBudget() {
    setShowBudgetWarning(false);

    if (pendingTransaction) {
      await actuallyCreate(pendingTransaction);
      setPendingTransaction(null);
    }
  }

  function openVoidModal(transaction) {
    setSelectedTransaction(transaction);
    setVoidReason("");
    setShowVoidConfirm(true);
  }

  async function handleVoidConfirm() {
    if (!selectedTransaction) return;

    await voidExistingTransaction(selectedTransaction.id, voidReason);

    setShowVoidConfirm(false);
    setSelectedTransaction(null);
    setShowVoidSuccess(true);
  }

  return (
    <AppLayout>
      <h1 className="dashboard__title">Transacciones</h1>

      <Panel title="Registrar movimiento">
        <TransactionForm
          key={formResetKey}
          accounts={accounts}
          categories={categories}
          onSubmit={handleFormSubmit}
        />
      </Panel>

      <Panel title="Historial">
        <TransactionFilters
          accounts={accounts}
          categories={categories}
          filters={filters}
          onChange={updateFilter}
          onClear={clearFilters}
        />

        {loadingList ? (
          <p style={{ color: "var(--text-muted)", padding: "1rem 0" }}>
            Cargando transacciones...
          </p>
        ) : (
          <>
            <TransactionsTable
              transactions={transactions}
              accountName={accountName}
              categoryName={categoryName}
              onVoid={openVoidModal}
            />

            <TransactionsPagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPrev={() => setPage((p) => Math.max(p - 1, 1))}
              onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          </>
        )}
      </Panel>

      {selectedTransaction && (
        <ConfirmModal
          open={showVoidConfirm}
          title="Anular transacción"
          message={
            <>
              <p>
                ¿Seguro que querés anular esta transacción de{" "}
                {formatCurrency(selectedTransaction.amount)}?
              </p>

              <p>
                Esta acción revierte el efecto sobre el saldo de la cuenta y queda
                registrada en el historial.
              </p>

              <input
                className="auth__input"
                style={{ marginTop: "0.75rem", width: "100%" }}
                placeholder="Motivo (opcional)"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
              />
            </>
          }
          confirmText="Anular"
          cancelText="Cancelar"
          onConfirm={handleVoidConfirm}
          onCancel={() => {
            setSelectedTransaction(null);
            setShowVoidConfirm(false);
          }}
        />
      )}

      {budgetWarning && (
        <ConfirmModal
          open={showBudgetWarning}
          title="Vas a pasarte del presupuesto"
          message={
            <p>
              Este gasto te va a dejar en{" "}
              <strong>{formatCurrency(budgetWarning.newSpent)}</strong> de los{" "}
              <strong>{formatCurrency(budgetWarning.limit)}</strong> presupuestados en
              "{budgetWarning.categoryName}". ¿Igual querés registrarlo?
            </p>
          }
          confirmText="Registrar de todas formas"
          cancelText="Cancelar"
          onConfirm={handleConfirmOverBudget}
          onCancel={() => {
            setShowBudgetWarning(false);
            setPendingTransaction(null);
          }}
        />
      )}

      {showInactiveAccountWarning && (
        <ConfirmModal
          open={showInactiveAccountWarning}
          title="Cuenta inactiva"
          message={
            <>
              <p>
                No puedes registrar un gasto o ingreso usando{" "}
                <strong>{inactiveAccountName}</strong>.
              </p>

              <p>
                La cuenta se encuentra inactiva. Actívala desde la sección de cuentas
                para poder registrar nuevas transacciones.
              </p>
            </>
          }
          confirmText="Entendido"
          cancelText="Cerrar"
          onConfirm={() => setShowInactiveAccountWarning(false)}
          onCancel={() => setShowInactiveAccountWarning(false)}
        />
      )}

      <ConfirmModal
        open={showErrorModal}
        title="No se pudo registrar el movimiento"
        message={<p>{errorMessage}</p>}
        confirmText="Entendido"
        cancelText="Cerrar"
        onConfirm={() => setShowErrorModal(false)}
        onCancel={() => setShowErrorModal(false)}
      />

      <SuccessModal
        open={showVoidSuccess}
        title="Transacción anulada"
        message="El saldo de la cuenta fue ajustado correctamente."
        onClose={() => setShowVoidSuccess(false)}
      />
    </AppLayout>
  );
}

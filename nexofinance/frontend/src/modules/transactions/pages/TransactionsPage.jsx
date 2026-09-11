import { useEffect, useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import ConfirmModal from "../../../components/ConfirmModal";
import SuccessModal from "../../../components/SuccessModal";
import { getAccounts } from "../../accounts/api/accounts";
import { getCategories } from "../../categories/api/categories";
import { getTransactions, createTransaction, voidTransaction } from "../api/transactions";
import { getBudgetProgress } from "../../budgets/api/budgets";
import "../../../styles/forms.css";
import "../styles/Transactions.css";

const PAGE_SIZE = 20;

function formatCurrency(value) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingList, setLoadingList] = useState(true);

  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [filterAccount, setFilterAccount] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

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

  function loadTransactions() {
    setLoadingList(true);
    getTransactions({
      account_id: filterAccount || undefined,
      category_id: filterCategory || undefined,
      transaction_type: filterType || undefined,
      date_from: filterFrom || undefined,
      date_to: filterTo || undefined,
      search: filterSearch || undefined,
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
  }, [filterAccount, filterCategory, filterType, filterFrom, filterTo, filterSearch, page]);

  // Si cambian los filtros, siempre volvemos a la página 1
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAccount, filterCategory, filterType, filterFrom, filterTo, filterSearch]);

  const filteredCategories = categories.filter((c) => c.category_type === type);
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  async function actuallyCreate(transactionData) {
    try {
      await createTransaction(transactionData);

      setAmount("");
      setNote("");
      setPage(1);
      loadTransactions();
    } catch (error) {
      const message = error.response?.data?.detail || "";

      if (message === "La cuenta se encuentra desactivada.") {
        const account = accounts.find(
          (a) => a.id === transactionData.account_id
        );

        setInactiveAccountName(account?.name || "Esta cuenta");
        setShowInactiveAccountWarning(true);
        return;
      }

      setErrorMessage(message || "No se pudo registrar la transacción.");
      setShowErrorModal(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const transactionData = {
      account_id: Number(accountId),
      category_id: Number(categoryId),
      transaction_type: type,
      amount: Number(amount),
      note: note || null,
      transaction_date: date,
    };

    if (type === "expense") {
      const month = date.slice(0, 7);
      const progress = await getBudgetProgress(month);
      const matching = progress.find(
        (p) => p.category_id === Number(categoryId)
      );

      if (matching) {
        const newSpent = matching.spent_amount + Number(amount);

        if (newSpent > matching.limit_amount) {
          setPendingTransaction(transactionData);
          setBudgetWarning({
            categoryName: matching.category_name,
            newSpent,
            limit: matching.limit_amount,
          });
          setShowBudgetWarning(true);
          return;
        }
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

  function clearFilters() {
    setFilterAccount("");
    setFilterCategory("");
    setFilterType("");
    setFilterFrom("");
    setFilterTo("");
    setFilterSearch("");
  }

  function openVoidModal(transaction) {
    setSelectedTransaction(transaction);
    setVoidReason("");
    setShowVoidConfirm(true);
  }

  async function handleVoidConfirm() {
    if (!selectedTransaction) return;

    await voidTransaction(
      selectedTransaction.id,
      voidReason || null
    );

    setShowVoidConfirm(false);
    setSelectedTransaction(null);
    setShowVoidSuccess(true);
    loadTransactions();
  }

  function accountName(id) {
    return accounts.find((a) => a.id === id)?.name || "—";
  }

  function categoryName(id) {
    return categories.find((c) => c.id === id)?.name || "—";
  }

  return (
    <AppLayout>
      <h1 className="dashboard__title">
        Transacciones
      </h1>

      <Panel title="Registrar movimiento">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>

            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              <option value="">Cuenta</option>

              {accounts.map((a) => (
                <option
                  key={a.id}
                  value={a.id}
                  disabled={a.status !== "ACTIVE"}
                >
                  {a.name}
                  {a.status !== "ACTIVE" ? " — Inactiva" : ""}
                </option>
              ))}
            </select>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Categoría</option>

              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <input
              placeholder="Monto"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <input
              placeholder="Nota (opcional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button className="form-submit" type="submit">
            Registrar
          </button>
        </form>
      </Panel>

      <Panel title="Historial">
        <div className="filters-bar">
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
          >
            <option value="">Todas las cuentas</option>

            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Ingresos y gastos</option>
            <option value="income">Solo ingresos</option>
            <option value="expense">Solo gastos</option>
          </select>

          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            title="Desde"
          />

          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            title="Hasta"
          />

          <input
            placeholder="Buscar nota..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />

          <button
            className="filters-bar__clear"
            onClick={clearFilters}
          >
            Limpiar filtros
          </button>
        </div>

        {loadingList ? (
          <p style={{ color: "var(--text-muted)", padding: "1rem 0" }}>
            Cargando transacciones...
          </p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cuenta</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Nota</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className={
                      t.is_voided
                        ? "data-table__voided-row"
                        : ""
                    }
                  >
                    <td>{t.transaction_date}</td>
                    <td>{accountName(t.account_id)}</td>
                    <td>{categoryName(t.category_id)}</td>

                    <td>
                      <span
                        className={`tag ${
                          t.transaction_type === "income"
                            ? "tag--income"
                            : "tag--expense"
                        }`}
                      >
                        {t.transaction_type === "income"
                          ? "Ingreso"
                          : "Gasto"}
                      </span>
                    </td>

                    <td>{formatCurrency(t.amount)}</td>
                    <td>{t.note || "—"}</td>

                    <td>
                      {t.is_voided ? (
                        <span className="tag tag--voided">
                          Anulada
                        </span>
                      ) : (
                        "Activa"
                      )}
                    </td>

                    <td>
                      {!t.is_voided && (
                        <button
                          className="form-submit"
                          onClick={() => openVoidModal(t)}
                        >
                          Anular
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>
                      No hay transacciones para estos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
                fontSize: "var(--text-sm)",
                color: "var(--text-muted)",
              }}
            >
              <span>
                {total === 0
                  ? "0 resultados"
                  : `Mostrando ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} de ${total}`}
              </span>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="filters-bar__clear"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Anterior
                </button>

                <span>
                  Página {page} de {totalPages}
                </span>

                <button
                  className="filters-bar__clear"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  Siguiente
                </button>
              </div>
            </div>
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
                Esta acción revierte el efecto sobre el saldo de la
                cuenta y queda registrada en el historial.
              </p>

              <input
                className="auth__input"
                style={{
                  marginTop: "0.75rem",
                  width: "100%",
                }}
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
              <strong>
                {formatCurrency(budgetWarning.newSpent)}
              </strong>{" "}
              de los{" "}
              <strong>
                {formatCurrency(budgetWarning.limit)}
              </strong>{" "}
              presupuestados en "
              {budgetWarning.categoryName}".
              ¿Igual querés registrarlo?
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
                La cuenta se encuentra inactiva. Actívala desde la
                sección de cuentas para poder registrar nuevas
                transacciones.
              </p>
            </>
          }
          confirmText="Entendido"
          cancelText="Cerrar"
          onConfirm={() => {
            setShowInactiveAccountWarning(false);
          }}
          onCancel={() => {
            setShowInactiveAccountWarning(false);
          }}
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
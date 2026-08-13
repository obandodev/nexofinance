import { useState } from "react";
import { Plus, RefreshCw, WalletCards } from "lucide-react";

import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";

import DebtCard from "../components/DebtCard";
import DebtForm from "../components/DebtForm";
import DebtPaymentModal from "../components/DebtPaymentModal";
import DebtPaymentsModal from "../components/DebtPaymentsModal";

import useDebts from "../hooks/useDebts";

import "../styles/Debts.css";

export default function DebtsPage() {
  const {
    debts,
    payments,
    loading,
    loadingPayments,
    error,
    loadDebts,
    loadPayments,
    createDebt,
    createPayment,
  } = useDebts();

  const [paymentDebt, setPaymentDebt] = useState(null);
  const [paymentsDebt, setPaymentsDebt] = useState(null);

  async function handleViewPayments(debt) {
    setPaymentsDebt(debt);
    await loadPayments(debt.id);
  }

  function handlePayment(debt) {
    setPaymentDebt(debt);
  }

  async function handleCreatePayment(debtId, data) {
    await createPayment(debtId, data);
    setPaymentDebt(null);
  }

  const totalToPay = debts
    .filter((debt) => debt.debt_type === "debt")
    .reduce(
      (total, debt) =>
        total +
        Math.max(
          Number(debt.total_amount || 0) -
            Number(debt.paid_amount || 0),
          0
        ),
      0
    );

  const totalToReceive = debts
    .filter((debt) => debt.debt_type === "loan")
    .reduce(
      (total, debt) =>
        total +
        Math.max(
          Number(debt.total_amount || 0) -
            Number(debt.paid_amount || 0),
          0
        ),
      0
    );

  return (
    <AppLayout>
      <div className="debts-page">
        <header className="debts-page__header">
          <div>
            <div className="debts-page__eyebrow">
              <WalletCards size={17} />
              Control financiero
            </div>

            <h1 className="debts-page__title">
              Deudas y préstamos
            </h1>

            <p className="debts-page__description">
              Lleva el control de lo que debes, lo que te deben y cada
              movimiento asociado.
            </p>
          </div>

          <button
            type="button"
            className="debts-page__refresh"
            onClick={loadDebts}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "debts-page__spin" : ""}
            />
            Actualizar
          </button>
        </header>

        {error && (
          <div className="debts-page__error">
            <strong>No se pudo completar la operación</strong>
            <span>{error}</span>
          </div>
        )}

        <section className="debts-summary">
          <div className="debts-summary__card debts-summary__card--pay">
            <span className="debts-summary__label">
              Debes
            </span>

            <strong className="debts-summary__amount">
              {formatCurrency(totalToPay)}
            </strong>

            <span className="debts-summary__description">
              Pendiente por pagar
            </span>
          </div>

          <div className="debts-summary__card debts-summary__card--receive">
            <span className="debts-summary__label">
              Te deben
            </span>

            <strong className="debts-summary__amount">
              {formatCurrency(totalToReceive)}
            </strong>

            <span className="debts-summary__description">
              Pendiente por recibir
            </span>
          </div>

          <div className="debts-summary__card debts-summary__card--total">
            <span className="debts-summary__label">
              Registradas
            </span>

            <strong className="debts-summary__amount">
              {debts.length}
            </strong>

            <span className="debts-summary__description">
              Deudas y préstamos
            </span>
          </div>
        </section>

        <Panel title="Registrar nueva deuda">
          <div className="debts-page__form-wrapper">
            <DebtForm onSubmit={createDebt} />
          </div>
        </Panel>

        <Panel title="Mis deudas y préstamos">
          {loading ? (
            <div className="debts-page__state">
              <div className="debts-page__loader" />
              <p>Cargando tus deudas...</p>
            </div>
          ) : debts.length === 0 ? (
            <div className="debts-page__empty">
              <div className="debts-page__empty-icon">
                <WalletCards size={26} />
              </div>

              <h3>No tienes deudas registradas</h3>

              <p>
                Registra una deuda o un préstamo para empezar a
                controlar tus movimientos.
              </p>

              <span>
                Puedes registrar tanto dinero que debes como dinero
                que te deben.
              </span>
            </div>
          ) : (
            <div className="debts-grid">
              {debts.map((debt) => (
                <DebtCard
                  key={debt.id}
                  debt={debt}
                  onPayment={handlePayment}
                  onViewPayments={handleViewPayments}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>

      <DebtPaymentModal
        debt={paymentDebt}
        open={Boolean(paymentDebt)}
        onClose={() => setPaymentDebt(null)}
        onSubmit={handleCreatePayment}
      />

      <DebtPaymentsModal
        debt={paymentsDebt}
        payments={payments}
        loading={loadingPayments}
        open={Boolean(paymentsDebt)}
        onClose={() => setPaymentsDebt(null)}
      />
    </AppLayout>
  );
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}
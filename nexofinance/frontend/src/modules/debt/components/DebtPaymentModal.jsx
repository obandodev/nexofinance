import { useEffect, useMemo, useState } from "react";

import Modal from "../../../components/Modal";
import { getAccounts } from "../../accounts/api/accounts";
import { formatCurrency } from "../utils/formatCurrency";

export default function DebtPaymentModal({
  debt,
  open,
  onClose,
  onSubmit,
}) {
  const [accounts, setAccounts] = useState([]);

  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");

  const [loadingAccounts, setLoadingAccounts] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const remaining = useMemo(() => {
    if (!debt) return 0;

    return Math.max(
      Number(debt.total_amount) -
        Number(debt.paid_amount),
      0
    );
  }, [debt]);

  const isLoan = debt?.debt_type === "loan";

  const numericAmount = Number(amount || 0);

  const remainingAfterPayment = Math.max(
    remaining - numericAmount,
    0
  );

  useEffect(() => {
    if (!open) return;

    async function loadAccounts() {
      try {
        setLoadingAccounts(true);
        setError("");

        const data = await getAccounts();

        setAccounts(
          data.filter(
            (account) =>
              account.status === "ACTIVE"
          )
        );
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "No se pudieron cargar las cuentas."
        );
      } finally {
        setLoadingAccounts(false);
      }
    }

    setAmount("");
    setAccountId("");
    setError("");

    loadAccounts();
  }, [open]);

  if (!debt) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!numericAmount || numericAmount <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }

    if (numericAmount > remaining) {
      setError(
        `El monto no puede superar ${formatCurrency(
          remaining
        )}.`
      );
      return;
    }

    if (!accountId) {
      setError(
        isLoan
          ? "Selecciona la cuenta donde recibiste el dinero."
          : "Selecciona la cuenta desde la que realizaste el pago."
      );
      return;
    }

    try {
      setSaving(true);

      await onSubmit(debt.id, {
        amount: numericAmount,
        account_id: Number(accountId),
        payment_date: new Date()
          .toISOString()
          .slice(0, 10),
      });

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "No se pudo registrar el movimiento."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        isLoan
          ? `Registrar cobro — ${debt.name}`
          : `Registrar pago — ${debt.name}`
      }
    >
      <form
        className="debt-payment-modal"
        onSubmit={handleSubmit}
      >
        <div className="debt-payment-modal__summary">
          <div>
            <span>
              Tipo de movimiento
            </span>

            <strong>
              {isLoan
                ? "Dinero que recibes"
                : "Dinero que sale"}
            </strong>
          </div>

          <div>
            <span>
              Pendiente actual
            </span>

            <strong>
              {formatCurrency(remaining)}
            </strong>
          </div>
        </div>

        <div className="debt-payment-modal__field">
          <label htmlFor="payment-amount">
            {isLoan
              ? "Monto recibido"
              : "Monto pagado"}
          </label>

          <input
            id="payment-amount"
            type="number"
            min="1"
            max={remaining}
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder="Ej: 300000"
          />
        </div>

        <div className="debt-payment-modal__field">
          <label htmlFor="payment-account">
            {isLoan
              ? "Cuenta donde recibiste el dinero"
              : "Cuenta desde donde sale el dinero"}
          </label>

          <select
            id="payment-account"
            value={accountId}
            onChange={(event) =>
              setAccountId(event.target.value)
            }
            disabled={loadingAccounts}
          >
            <option value="">
              {loadingAccounts
                ? "Cargando cuentas..."
                : "Selecciona una cuenta"}
            </option>

            {accounts.map((account) => (
              <option
                key={account.id}
                value={account.id}
              >
                {account.name} —{" "}
                {formatCurrency(account.balance)}
              </option>
            ))}
          </select>
        </div>

        {numericAmount > 0 && (
          <div className="debt-payment-modal__preview">
            <span>
              Pendiente después del movimiento
            </span>

            <strong>
              {formatCurrency(
                remainingAfterPayment
              )}
            </strong>
          </div>
        )}

        {error && (
          <p className="debt-payment-modal__error">
            {error}
          </p>
        )}

        <div className="debt-payment-modal__actions">
          <button
            type="button"
            className="debt-modal__cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="form-submit"
            disabled={saving}
          >
            {saving
              ? "Guardando..."
              : isLoan
              ? "Registrar cobro"
              : "Registrar pago"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
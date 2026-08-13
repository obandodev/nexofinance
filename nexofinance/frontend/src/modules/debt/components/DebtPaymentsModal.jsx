import Modal from "../../../components/Modal";
import { formatCurrency } from "../utils/formatCurrency";

export default function DebtPaymentsModal({
  debt,
  payments,
  loading,
  open,
  onClose,
}) {
  if (!debt) return null;

  const isLoan = debt.debt_type === "loan";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Movimientos — ${debt.name}`}
    >
      <div className="debt-payments-modal">
        <div className="debt-payments-modal__summary">
          <div>
            <span>Total</span>

            <strong>
              {formatCurrency(
                debt.total_amount
              )}
            </strong>
          </div>

          <div>
            <span>
              {isLoan ? "Recibido" : "Pagado"}
            </span>

            <strong>
              {formatCurrency(
                debt.paid_amount
              )}
            </strong>
          </div>

          <div>
            <span>Pendiente</span>

            <strong>
              {formatCurrency(
                Math.max(
                  debt.total_amount -
                    debt.paid_amount,
                  0
                )
              )}
            </strong>
          </div>
        </div>

        {loading ? (
          <p className="debt-payments-modal__empty">
            Cargando movimientos...
          </p>
        ) : payments.length === 0 ? (
          <p className="debt-payments-modal__empty">
            Todavía no hay movimientos registrados
            para esta deuda.
          </p>
        ) : (
          <div className="debt-payments-modal__list">
            {payments.map((payment) => (
              <div
                className="debt-payment-item"
                key={payment.id}
              >
                <div>
                  <strong>
                    {formatCurrency(
                      payment.amount
                    )}
                  </strong>

                  <span>
                    {payment.payment_date}
                  </span>
                </div>

                <div>
                  <span>
                    {isLoan ? "Recibido en" : "Pagado desde"}{" "}
                    <strong>
                      {payment.account_name || `Cuenta #${payment.account_id}`}
                    </strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="debt-payments-modal__actions">
          <button
            type="button"
            className="debt-modal__cancel"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
import ConfirmModal from "../../../components/ConfirmModal";
import { formatCurrency } from "../utils/formatCurrency";

export default function CancelDebtModal({
  open,
  debt,
  onConfirm,
  onCancel,
  error,
}) {
  const isLoan = debt?.debt_type === "loan";

  return (
    <ConfirmModal
      open={open}
      title={isLoan ? "Anular préstamo" : "Anular deuda"}
      message={
        <div>
          <p>
            <strong>{debt?.name}</strong>
          </p>

          <p>
            Monto total: {formatCurrency(debt?.total_amount)}
          </p>

          <p>
            Esta acción anulará el registro. Solo puedes anular
            deudas o préstamos que todavía no tengan pagos
            registrados.
          </p>

          {error && (
            <p style={{ color: "#dc2626" }}>{error}</p>
          )}
        </div>
      }
      confirmText={isLoan ? "Anular préstamo" : "Anular deuda"}
      cancelText="Cancelar"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
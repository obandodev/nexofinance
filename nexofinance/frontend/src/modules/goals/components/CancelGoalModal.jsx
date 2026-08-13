import ConfirmModal from "../../../components/ConfirmModal";
import { formatCurrency } from "../utils/formatCurrency";

export default function CancelGoalModal({ open, goal, onConfirm, onCancel, error }) {
  return <ConfirmModal open={open} title="Anular meta" message={<div className="savings-modal__body"><div className="savings-modal__summary"><div className="savings-modal__summary-item"><span className="savings-modal__label">Meta</span><strong className="savings-modal__value">{goal?.name}</strong></div><div className="savings-modal__summary-item"><span className="savings-modal__label">Ahorro acumulado</span><strong className="savings-modal__value">{formatCurrency(goal?.current_amount)}</strong></div></div><p className="savings-modal__info">La meta quedará anulada y conservará su historial. No se eliminarán sus registros.</p>{error&&<p className="savings-modal__error">{error}</p>}</div>} confirmText="Anular meta" cancelText="Cancelar" onConfirm={onConfirm} onCancel={onCancel}/>
}

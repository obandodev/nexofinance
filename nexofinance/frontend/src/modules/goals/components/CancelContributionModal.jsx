import ConfirmModal from "../../../components/ConfirmModal";
import { formatCurrency } from "../utils/formatCurrency";

export default function CancelContributionModal({ open, contribution, goal, onConfirm, onCancel, error }) {
  return <ConfirmModal open={open} title="Anular aporte" message={<div className="savings-modal__body"><div className="savings-modal__summary"><div className="savings-modal__summary-item"><span className="savings-modal__label">Meta</span><strong className="savings-modal__value">{goal?.name}</strong></div><div className="savings-modal__summary-item"><span className="savings-modal__label">Aporte</span><strong className="savings-modal__value">{formatCurrency(contribution?.amount)}</strong></div></div><p className="savings-modal__info">El aporte se marcará como anulado, se devolverá el dinero a la cuenta de origen y se actualizará el progreso de la meta.</p>{error&&<p className="savings-modal__error">{error}</p>}</div>} confirmText="Anular aporte" cancelText="Cancelar" onConfirm={onConfirm} onCancel={onCancel}/>
}

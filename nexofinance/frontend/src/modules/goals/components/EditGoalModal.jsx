import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { formatCurrency } from "../utils/formatCurrency";

export default function EditGoalModal({ open, goal, onConfirm, onCancel }) {
  const [name, setName] = useState(""); const [target, setTarget] = useState(""); const [error, setError] = useState("");
  useEffect(() => { if (goal) { setName(goal.name); setTarget(goal.target_amount); setError(""); } }, [goal]);
  async function handleConfirm() {
    const numericTarget=Number(target);
    if(!name.trim()) return setError("Ingresa un nombre para la meta.");
    if(!numericTarget || numericTarget<=0) return setError("Ingresa un monto objetivo válido.");
    if(numericTarget<goal.current_amount) return setError("El monto objetivo no puede ser menor al ahorro actual.");
    try { await onConfirm({name:name.trim(),target_amount:numericTarget}); } catch(e){setError(e?.message||"No se pudo actualizar la meta.");}
  }
  return <Modal open={open} wide title="Editar meta" onClose={onCancel} actions={<><button className="confirm-btn cancel" type="button" onClick={onCancel}>Cancelar</button><button className="confirm-btn primary" type="button" onClick={handleConfirm}>Guardar cambios</button></>}>
    <div className="savings-modal__body">
      <div className="savings-modal__summary"><div className="savings-modal__summary-item"><span className="savings-modal__label">Ahorro actual</span><strong className="savings-modal__value">{formatCurrency(goal?.current_amount)}</strong></div><div className="savings-modal__summary-item"><span className="savings-modal__label">Objetivo actual</span><strong className="savings-modal__value">{formatCurrency(goal?.target_amount)}</strong></div></div>
      <div className="savings-modal__field"><label htmlFor="goal-name">Nombre</label><input id="goal-name" value={name} onChange={(e)=>setName(e.target.value)} /></div>
      <div className="savings-modal__field"><label htmlFor="goal-target">Monto objetivo</label><input id="goal-target" type="number" min={goal?.current_amount||1} value={target} onChange={(e)=>setTarget(e.target.value)} /></div>
      {error && <p className="savings-modal__error">{error}</p>}
    </div>
  </Modal>;
}

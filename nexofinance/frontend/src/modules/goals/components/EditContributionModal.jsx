import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { formatCurrency } from "../utils/formatCurrency";

export default function EditContributionModal({ open, contribution, accounts, goal, onConfirm, onCancel }) {
  const [amount,setAmount]=useState(""); const [accountId,setAccountId]=useState(""); const [date,setDate]=useState(""); const [error,setError]=useState("");
  useEffect(()=>{if(contribution){setAmount(contribution.amount);setAccountId(String(contribution.account_id));setDate(contribution.contribution_date);setError("");}},[contribution]);
  async function handleConfirm(){const numericAmount=Number(amount);const maxAmount=goal.target_amount-goal.current_amount+contribution.amount;if(!numericAmount||numericAmount<=0)return setError("Ingresa un monto válido.");if(numericAmount>maxAmount)return setError(`El aporte no puede superar ${formatCurrency(maxAmount)}.`);if(!accountId)return setError("Selecciona una cuenta.");try{await onConfirm({amount:numericAmount,account_id:Number(accountId),contribution_date:date});}catch(e){setError(e?.message||"No se pudo actualizar el aporte.");}}
  return <Modal open={open} wide title="Editar aporte" onClose={onCancel} actions={<><button className="confirm-btn cancel" type="button" onClick={onCancel}>Cancelar</button><button className="confirm-btn primary" type="button" onClick={handleConfirm}>Guardar cambios</button></>}>
    <div className="savings-modal__body">
      <div className="savings-modal__summary"><div className="savings-modal__summary-item"><span className="savings-modal__label">Meta</span><strong className="savings-modal__value">{goal?.name}</strong></div><div className="savings-modal__summary-item"><span className="savings-modal__label">Aporte actual</span><strong className="savings-modal__value">{formatCurrency(contribution?.amount)}</strong></div></div>
      <div className="savings-modal__field"><label htmlFor="edit-contribution-amount">Monto</label><input id="edit-contribution-amount" type="number" min="1" value={amount} onChange={(e)=>setAmount(e.target.value)} /></div>
      <div className="savings-modal__field"><label htmlFor="edit-contribution-account">Cuenta</label><select id="edit-contribution-account" value={accountId} onChange={(e)=>setAccountId(e.target.value)}><option value="">Selecciona una cuenta</option>{accounts.map((a)=><option key={a.id} value={a.id}>{a.name} · {formatCurrency(a.balance)}</option>)}</select></div>
      <div className="savings-modal__field"><label htmlFor="edit-contribution-date">Fecha</label><input id="edit-contribution-date" type="date" value={date} onChange={(e)=>setDate(e.target.value)} /></div>
      {error&&<p className="savings-modal__error">{error}</p>}
    </div>
  </Modal>;
}

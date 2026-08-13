import { Pencil, Ban, Wallet } from "lucide-react";
import Modal from "../../../components/Modal";
import { formatCurrency } from "../utils/formatCurrency";

export default function ContributionsModal({ open, goal, contributions, accounts, onEdit, onCancelContribution, onClose }) {
  const accountName=(id)=>accounts.find((a)=>a.id===id)?.name||`Cuenta #${id}`;
  return <Modal open={open} wide title={`Aportes · ${goal?.name||"Meta"}`} onClose={onClose} actions={<button className="confirm-btn cancel" type="button" onClick={onClose}>Cerrar</button>}>
    <div className="savings-modal__body">
      <div className="savings-modal__summary"><div className="savings-modal__summary-item"><span className="savings-modal__label">Ahorro acumulado</span><strong className="savings-modal__value">{formatCurrency(goal?.current_amount)}</strong></div><div className="savings-modal__summary-item"><span className="savings-modal__label">Registros</span><strong className="savings-modal__value">{contributions.length}</strong></div></div>
      {contributions.length===0?<div className="savings-empty">Esta meta todavía no tiene aportes registrados.</div>:<div className="contributions-list">{contributions.map((item)=><div key={item.id} className={`contribution-item${item.status!=="ACTIVE"?" contribution-item--cancelled":""}`}><div className="contribution-item__main"><div className="contribution-item__amount">{formatCurrency(item.amount)}</div><div className="contribution-item__meta"><Wallet size={13}/> {accountName(item.account_id)} · {item.contribution_date} · {item.status === "ACTIVE" ? "Activo" : "Anulado"}</div></div>{item.status==="ACTIVE"&&<div className="contribution-item__actions"><button className="confirm-btn cancel" type="button" onClick={()=>onEdit(item)}><Pencil size={14}/> Editar</button><button className="confirm-btn danger" type="button" onClick={()=>onCancelContribution(item)}><Ban size={14}/> Anular</button></div>}</div>)}</div>}
    </div>
  </Modal>;
}

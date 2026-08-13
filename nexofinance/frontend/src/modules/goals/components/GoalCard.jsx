import { Ban, History, Pencil, Plus } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

export default function GoalCard({ goal, onAdd, onViewContributions, onEdit, onCancel }) {
  const percent=Math.min((goal.current_amount/goal.target_amount)*100,100);
  const remaining=Math.max(goal.target_amount-goal.current_amount,0);
  const cancelled=goal.status!=="ACTIVE";
  return <article className={`goal-card${cancelled?" goal-card--cancelled":""}`}>
    <div className="goal-card__header"><span className="goal-card__title">{goal.name}</span><span className="goal-card__amounts">{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span></div>
    <div className="goal-card__track"><div className="goal-card__fill" style={{width:`${percent}%`,background:cancelled?"#94a3b8":"var(--emerald)"}}/></div>
    <div className="goal-card__meta"><span>{cancelled?"Meta cancelada":remaining>0?`Falta: ${formatCurrency(remaining)}`:"Meta completada"}</span><span>{percent.toFixed(0)}%</span></div>
    <div className="goal-card__actions">
      {!cancelled&&remaining>0&&<button className="form-submit" type="button" onClick={()=>onAdd(goal)}><Plus size={16}/> Agregar ahorro</button>}
      <button className="confirm-btn cancel" type="button" onClick={()=>onViewContributions(goal)}><History size={16}/> Aportes</button>
      {!cancelled&&<><button className="confirm-btn cancel" type="button" onClick={()=>onEdit(goal)}><Pencil size={16}/> Editar</button><button className="confirm-btn danger" type="button" onClick={()=>onCancel(goal)}><Ban size={16}/> Anular</button></>}
    </div>
  </article>;
}

import { useState } from "react";

export default function GoalForm({ onSubmit }) {
  const [name,setName]=useState(""); const [targetAmount,setTargetAmount]=useState(""); const [error,setError]=useState("");
  async function handleSubmit(event){event.preventDefault();const target=Number(targetAmount);if(!name.trim())return setError("Ingresa un nombre para la meta.");if(!target||target<=0)return setError("Ingresa un monto objetivo válido.");try{await onSubmit({name:name.trim(),target_amount:target});setName("");setTargetAmount("");setError("");}catch(e){setError(e?.message||"No se pudo crear la meta.");}}
  return <form onSubmit={handleSubmit}><div className="form-row"><input placeholder="Nombre (ej. Viaje a Cartagena)" value={name} onChange={(e)=>setName(e.target.value)} required/><input placeholder="Monto objetivo" type="number" min="1" value={targetAmount} onChange={(e)=>setTargetAmount(e.target.value)} required/></div>{error&&<p className="savings-modal__error">{error}</p>}<button className="form-submit" type="submit">Crear meta</button></form>;
}

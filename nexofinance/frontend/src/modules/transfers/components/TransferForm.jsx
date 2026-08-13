import { useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";

export default function TransferForm({accounts,onSubmit,error}){
  const [from,setFrom]=useState("");const[to,setTo]=useState("");const[amount,setAmount]=useState("");const[note,setNote]=useState("");const[date,setDate]=useState(new Date().toISOString().slice(0,10));
  async function submit(e){e.preventDefault();await onSubmit({from_account_id:Number(from),to_account_id:Number(to),amount:Number(amount),note:note||null,transfer_date:date});setAmount("");setNote("");}
  return <form onSubmit={submit}><div className="form-row"><select value={from} onChange={e=>setFrom(e.target.value)} required><option value="">Desde</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name} ({formatCurrency(a.balance)})</option>)}</select><select value={to} onChange={e=>setTo(e.target.value)} required><option value="">Hacia</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></div><div className="form-row"><input placeholder="Monto" type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} required/><input placeholder="Nota (opcional)" value={note} onChange={e=>setNote(e.target.value)}/><input type="date" value={date} onChange={e=>setDate(e.target.value)} required/></div>{error&&<p className="savings-modal__error">{error}</p>}<button className="form-submit" type="submit">Transferir</button></form>;
}

import { useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import SuccessModal from "../../../components/SuccessModal";
import TransferForm from "../components/TransferForm";
import TransferHistory from "../components/TransferHistory";
import useTransfers from "../hooks/useTransfers";
import "../../../styles/forms.css";
import "../styles/Transfers.css";

export default function TransfersPage(){
  const {accounts,transfers,loading,register}=useTransfers(); const[error,setError]=useState("");const[success,setSuccess]=useState(false);
  async function submit(data){setError("");try{if(data.from_account_id===data.to_account_id)throw new Error("La cuenta origen y destino no pueden ser la misma");await register(data);setSuccess(true);}catch(e){setError(e.response?.data?.detail||e.message||"No se pudo registrar la transferencia");}}
  return <AppLayout><h1 className="dashboard__title">Transferencias</h1><p style={{color:"var(--text-muted)",fontSize:"var(--text-sm)",marginTop:"-.5rem",marginBottom:"1rem"}}>Mové dinero entre tus propias cuentas. No afecta tus ingresos ni gastos.</p><Panel title="Nueva transferencia"><TransferForm accounts={accounts} onSubmit={submit} error={error}/></Panel><Panel title="Historial de transferencias">{loading?<p>Cargando...</p>:<TransferHistory transfers={transfers} accounts={accounts}/>}</Panel><SuccessModal open={success} title="Transferencia exitosa" message="El dinero se movió correctamente entre tus cuentas." onClose={()=>setSuccess(false)}/></AppLayout>;
}

import { useEffect, useState } from "react";
import { getAccounts } from "../../accounts/api/accounts";
import { getTransfers, createTransfer } from "../api/transfers";

export default function useTransfers() {
  const [accounts,setAccounts]=useState([]); const [transfers,setTransfers]=useState([]); const [loading,setLoading]=useState(true);
  async function refresh(){setLoading(true);try{const [all,history]=await Promise.all([getAccounts(),getTransfers()]);setAccounts(all.filter(a=>a.status==="ACTIVE"));setTransfers(history);}finally{setLoading(false);}}
  useEffect(()=>{refresh().catch(console.error)},[]);
  async function register(data){await createTransfer(data);await refresh();}
  return {accounts,transfers,loading,register};
}

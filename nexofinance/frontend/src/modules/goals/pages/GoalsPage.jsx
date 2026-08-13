import { useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import ConfirmModal from "../../../components/ConfirmModal";
import GoalForm from "../components/GoalForm";
import GoalCard from "../components/GoalCard";
import ContributionModal from "../components/ContributionModal";
import EditGoalModal from "../components/EditGoalModal";
import ContributionsModal from "../components/ContributionsModal";
import EditContributionModal from "../components/EditContributionModal";
import CancelGoalModal from "../components/CancelGoalModal";
import CancelContributionModal from "../components/CancelContributionModal";
import useSavingsGoals from "../hooks/useSavingsGoals";
import "../styles/Goals.css";

export default function GoalsPage() {
  const savings=useSavingsGoals();
  const [modal,setModal]=useState(null);
  const [actionError,setActionError]=useState("");

  function open(name, goal=null, contribution=null){savings.setSelectedGoal(goal);savings.setSelectedContribution(contribution);setActionError("");setModal(name);}
  function close(){setModal(null);savings.setSelectedContribution(null);setActionError("");}

  async function run(action, fallback){
    try { await action(); close(); }
    catch(error){ setActionError(savings.apiError(error,fallback)); throw error; }
  }

  async function handleCancelGoal(){
    try { await savings.cancelGoal(savings.selectedGoal.id); close(); }
    catch(error){ setActionError(savings.apiError(error,"No se pudo anular la meta.")); }
  }

  async function handleCancelContribution(){
    try { await savings.cancelContribution(savings.selectedContribution.id,savings.selectedGoal.id); close(); }
    catch(error){ setActionError(savings.apiError(error,"No se pudo anular el aporte.")); }
  }

  return <AppLayout>
    <h1 className="dashboard__title">Metas de ahorro</h1>
    <Panel title="Nueva meta"><GoalForm onSubmit={(data)=>savings.createGoal(data)}/></Panel>
    <Panel title="Tus metas">
      {savings.loading&&<p className="goals-page__empty">Cargando metas...</p>}
      {!savings.loading&&savings.goals.length===0&&<p className="goals-page__empty">Todavía no tenés metas creadas.</p>}
      {savings.goals.map((goal)=><GoalCard key={goal.id} goal={goal} onAdd={(g)=>open("add",g)} onViewContributions={async(g)=>{try{await savings.refreshContributions(g.id);open("contributions",g);}catch(e){setActionError(savings.apiError(e,"No se pudieron cargar los aportes."));}}} onEdit={(g)=>open("edit-goal",g)} onCancel={(g)=>open("cancel-goal",g)}/>)}
    </Panel>

    <ContributionModal open={modal==="add"} goal={savings.selectedGoal} accounts={savings.activeAccounts} onConfirm={(data)=>run(()=>savings.addContribution(savings.selectedGoal.id,data),"No se pudo realizar el aporte.")} onCancel={close}/>
    <EditGoalModal open={modal==="edit-goal"} goal={savings.selectedGoal} onConfirm={(changes)=>run(()=>savings.editGoal(savings.selectedGoal.id,changes),"No se pudo actualizar la meta.")} onCancel={close}/>
    <ContributionsModal open={modal==="contributions"} goal={savings.selectedGoal} contributions={savings.contributions} accounts={savings.accounts} onEdit={(item)=>open("edit-contribution",savings.selectedGoal,item)} onCancelContribution={(item)=>open("cancel-contribution",savings.selectedGoal,item)} onClose={close}/>
    <EditContributionModal open={modal==="edit-contribution"} contribution={savings.selectedContribution} accounts={savings.activeAccounts} goal={savings.selectedGoal} onConfirm={(changes)=>run(()=>savings.editContribution(savings.selectedContribution.id,changes,savings.selectedGoal.id),"No se pudo actualizar el aporte.")} onCancel={close}/>
    <CancelGoalModal open={modal==="cancel-goal"} goal={savings.selectedGoal} error={actionError} onConfirm={handleCancelGoal} onCancel={close}/>
    <CancelContributionModal open={modal==="cancel-contribution"} contribution={savings.selectedContribution} goal={savings.selectedGoal} error={actionError} onConfirm={handleCancelContribution} onCancel={close}/>
    {actionError&&!modal&&<ConfirmModal open title="No se pudo completar la acción" message={actionError} confirmText="Cerrar" cancelText="Cerrar" onConfirm={()=>setActionError("")} onCancel={()=>setActionError("")}/>} 
  </AppLayout>;
}

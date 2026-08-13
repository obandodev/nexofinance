import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./modules/auth/pages/Login";
import Signup from "./modules/auth/pages/Signup";
import ForgotPassword from "./modules/auth/pages/ForgotPassword";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import AccountsPage from "./modules/accounts/pages/AccountsPage";
import TransactionsPage from "./modules/transactions/pages/TransactionsPage";
import BudgetsPage from "./modules/budgets/pages/BudgetsPage";
import GoalsPage from "./modules/goals/pages/GoalsPage";
import DebtsPage from "./modules/debt/pages/DebtsPage";
import CategoriesPage from "./modules/categories/pages/CategoriesPage";
import TransfersPage from "./modules/transfers/pages/TransfersPage";

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/cuentas" element={<Protected><AccountsPage /></Protected>} />
        <Route path="/transacciones" element={<Protected><TransactionsPage /></Protected>} />
        <Route path="/presupuestos" element={<Protected><BudgetsPage /></Protected>} />
        <Route path="/metas" element={<Protected><GoalsPage /></Protected>} />
        <Route path="/deudas" element={<Protected><DebtsPage /></Protected>} />
        <Route path="/categorias" element={<Protected><CategoriesPage /></Protected>} />
        <Route path="/transferencias" element={<Protected><TransfersPage /></Protected>} />
      </Routes>
    </AuthProvider>
  );
}

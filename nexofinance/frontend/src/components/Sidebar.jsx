import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Receipt,
  Tags,
  PiggyBank,
  Target,
  HandCoins,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../modules/auth/context/AuthContext";
import "./Sidebar.css";

const LINKS = [
  { to: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { to: "/cuentas", label: "Cuentas", icon: Wallet },
  { to: "/transferencias", label: "Transferencias", icon: ArrowLeftRight },
  { to: "/transacciones", label: "Transacciones", icon: Receipt },
  { to: "/categorias", label: "Categorías", icon: Tags },
  { to: "/presupuestos", label: "Presupuestos", icon: PiggyBank },
  { to: "/metas", label: "Metas de ahorro", icon: Target },
  { to: "/deudas", label: "Deudas", icon: HandCoins },
  { to: "/perfil", label: "Mi perfil", icon: UserCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-dot" />
        NexoFinance
      </div>

      <nav className="sidebar__nav">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className="sidebar__link">
              <Icon size={17} className="sidebar__link-icon" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__user">{user?.full_name}</span>
        <button className="sidebar__logout" onClick={handleLogout}>
          <LogOut size={14} style={{ marginRight: "0.4rem" }} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
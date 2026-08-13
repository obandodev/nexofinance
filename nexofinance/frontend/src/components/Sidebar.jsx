import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/context/AuthContext";
import "./Sidebar.css";

const LINKS = [
  { to: "/dashboard", label: "Resumen" },
  { to: "/cuentas", label: "Cuentas" },
  { to: "/transferencias", label: "Transferencias" },
  { to: "/transacciones", label: "Transacciones" },
  { to: "/categorias", label: "Categorías" },
  { to: "/presupuestos", label: "Presupuestos" },
  { to: "/metas", label: "Metas de ahorro" },
  { to: "/deudas", label: "Deudas" },
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
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className="sidebar__link">
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__user">{user?.full_name}</span>
        <button className="sidebar__logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}

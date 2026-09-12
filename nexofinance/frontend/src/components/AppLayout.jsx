import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <button
        className="app-layout__menu-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-layout__content">{children}</main>
    </div>
  );
}

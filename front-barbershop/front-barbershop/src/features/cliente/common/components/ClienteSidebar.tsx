import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../../auth/authStore";

export default function ClienteSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/cliente/discovery" },
    {
      label: "Reservations",
      icon: "calendar_month",
      path: "/cliente/appoinments",
    },
    {
      label: "Notifications",
      icon: "notifications",
      path: "/cliente/notifications",
    },
  ];

  function isActive(path: string): boolean {
    if (path === "/cliente/discovery") {
      return (
        location.pathname === "/cliente/discovery" ||
        location.pathname.startsWith("/cliente/barbershop")
      );
    }
    return location.pathname === path;
  }

  return (
    <>
      {/* Botón hamburguesa - solo visible cuando no está abierto y en móvil */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-[80] lg:hidden bg-[#1a1a1a] p-2 rounded-lg text-primary shadow-lg border border-outline-variant/10"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      )}

      {/* Overlay para cerrar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0e0e0e] flex flex-col p-6 z-[75] transition-transform duration-300 shadow-[0px_24px_48px_rgba(0,0,0,0.5)] 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:shrink-0`}
      >
        {/* Header del sidebar */}
        <div className="mb-12 px-2">
          <h2 className="text-2xl font-bold tracking-tighter text-[#f2ca50]">
            Julian Sterling
          </h2>
          <p className="text-xs text-on-surface-variant/60 tracking-widest uppercase mt-1">
            Client
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                isActive(item.path)
                  ? "flex items-center gap-3 bg-[#2a2a2a] text-[#f2ca50] rounded-full px-4 py-3 font-semibold"
                  : "flex items-center gap-3 text-[#e5e2e1]/60 hover:text-[#e5e2e1] px-4 py-3 hover:bg-[#201f1f] transition-all duration-300 rounded-full"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 text-error/80 hover:text-error px-4 py-3 hover:bg-error-container/10 rounded-lg transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </aside>
    </>
  );
}

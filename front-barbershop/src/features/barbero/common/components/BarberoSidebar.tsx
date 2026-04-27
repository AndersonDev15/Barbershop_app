import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../../auth/authStore";

export type BarberoView =
  | "performance"
  | "availability"
  | "appointments"
  | "cash-desk"
  | "breaks"
  | "notifications";

interface BarberoSidebarProps {
  // These are kept for compatibility with existing pages,
  // though navigation is now route-based
  isOpen?: boolean;
  onClose?: () => void;
  activeView?: BarberoView;
  onViewChange?: (view: any) => void;
}

export default function BarberoSidebar({ onViewChange }: BarberoSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user
    ? `${user.given_name} ${user.family_name}`.trim() || user.name
    : "";

  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      id: "performance",
      icon: "dashboard",
      label: "Dashboard",
      path: "/barbero/dashboard",
    },
    {
      id: "availability",
      icon: "calendar_today",
      label: "Daily Availability",
      path: "/barbero/availability",
    },
    {
      id: "appointments",
      icon: "event_note",
      label: "Today's Appointments",
      path: "/barbero/appointments/today",
    },
    {
      id: "cash-desk",
      icon: "payments",
      label: "Cash Desk",
      path: "/barbero/cash-desk",
    },
    { id: "breaks", icon: "coffee", label: "Breaks", path: "/barbero/breaks" },
    {
      id: "notifications",
      icon: "notifications",
      label: "Notifications",
      path: "/barbero/notifications",
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8090/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "http://127.0.0.1:5173/";
    }
  };

  return (
    <>
      {/* Botón hamburguesa — visible solo en mobile */}
      {!isOpen && (
        <button
          className="lg:hidden fixed top-4 left-4 z-[80] w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-full text-on-surface shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      )}

      {/* Overlay — visible en mobile cuando sidebar abierto */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0e0e0e] rounded-r-[2rem] 
          shadow-[24px_0px_48px_rgba(0,0,0,0.5)] flex flex-col py-8 px-4 
          z-[75] transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-50 lg:shrink-0
        `}
      >
        {/* Botón cerrar — solo mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          onClick={() => setIsOpen(false)}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <div className="mb-10 px-4 flex items-start justify-between">
          <div className="flex flex-col">
            {/* Logo row */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-on-primary">
                  content_cut
                </span>
              </div>
              <span className="text-xl font-bold text-[#f2ca50] font-headline">
                BarberOS
              </span>
            </div>

            {/* Avatar row */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border-2 border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {displayName ? getInitials(displayName) : ""}
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-on-surface">
                  {displayName}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-tight text-on-surface-variant">
                  Barber
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2 px-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => {
                  setIsOpen(false);
                  if (
                    onViewChange &&
                    (item.id === "performance" || item.id === "availability")
                  ) {
                    onViewChange(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 ${
                  active
                    ? "text-[#f2ca50] font-bold border-r-4 border-[#f2ca50] bg-[#1c1b1b]"
                    : "text-[#e5e2e1] opacity-60 hover:bg-[#2a2a2a] hover:text-[#f2ca50] hover:opacity-100"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-['Manrope'] tracking-tight text-[10px] uppercase font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-2 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-error opacity-80 hover:bg-[#2a2a2a] hover:opacity-100 transition-all duration-300"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-['Manrope'] tracking-tight text-[10px] uppercase font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

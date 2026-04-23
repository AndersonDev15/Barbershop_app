import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/authStore";
import Avatar from "../../../../components/ui/Avatar";

const navItems = [
  { icon: "dashboard", label: "Dashboard", path: "/barberia/home" },
  {
    icon: "settings_account_box",
    label: "Operations",
    path: "/barberia/operations",
  },
  { icon: "content_cut", label: "Barbers", path: "/barberia/barberos" },
  { icon: "dry_cleaning", label: "Services", path: "/barberia/servicios" },
  { icon: "calendar_today", label: "Schedule", path: "/barberia/agenda" },
  { icon: "notifications", label: "Notifications", path: "/barberia/notifications" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
}: SidebarProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
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
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          bg-[#0e0e0e] h-screen w-64 fixed left-0 top-0 flex flex-col pt-6 pb-6 px-4 font-['Manrope'] tracking-tight z-50
          transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="mb-6 px-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-[#f2ca50]">
              Lather &amp; Lead
            </h1>
            <p className="text-xs text-[#d0c5af]/60">Midnight Atelier</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-[#d0c5af]/40 hover:text-[#f2ca50] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 text-left
                  ${
                    isActive
                      ? "text-[#f2ca50] font-bold bg-gradient-to-r from-[#f2ca50]/15 to-[#f2ca50]/5 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-[#f2ca50] after:rounded-l-sm"
                      : "text-[#d0c5af]/60 hover:text-[#e5e2e1] hover:bg-white/5"
                  }
                `}
              >
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#1c1b1b] rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <Avatar
                name={user?.name ?? "Admin"}
                size="md"
                src={user?.coverImageUrl}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#e5e2e1]">
                  {user?.name ?? "Admin"}
                </span>
                <span className="text-[10px] text-[#d0c5af]/60 uppercase tracking-wider font-bold">
                  {user?.roles?.[0]?.replace("ROLE_", "") ?? "Admin"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#d0c5af]/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
              title="Logout"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

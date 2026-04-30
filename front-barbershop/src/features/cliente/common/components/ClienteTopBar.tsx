import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import ClienteSearchBar from "../../discovery/components/ClienteSearchBar";
import ClienteSettingsModal from "./ClienteSettingsModal";
import { useAuthStore } from "../../../auth/authStore";
import { useNotificationBell } from "../../../../hooks/useNotificationBell";
import {
  getNotificationMeta,
  formatNotificationTime,
} from "../../../../utils/notificationMapper";

export default function ClienteTopBar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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

  const { notifications, unreadCount, markAsRead } = useNotificationBell();

  const handleLogout = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${import.meta.env.VITE_BFF_URL}/logout`;
    document.body.appendChild(form);
    form.submit();
  };

  const isDiscovery = location.pathname === "/cliente/discovery";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 w-full z-40 flex justify-between items-center pl-16 lg:pl-8 pr-4 md:pr-8 bg-[#131313]/80 backdrop-blur-xl border-b border-outline-variant/10 h-16">
      <div className="flex-1 max-w-xl mx-auto px-4 flex items-center justify-center lg:justify-start">
        {!isDiscovery && (
          <>
            {/* Desktop Search */}
            <div className="hidden md:block w-full animate-in fade-in slide-in-from-top-2 duration-300">
              <ClienteSearchBar variant="navbar" />
            </div>

            {/* Mobile Search Icon & Floating Input */}
            <div className="md:hidden relative" ref={searchRef}>
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`p-2 rounded-full transition-all ${isMobileSearchOpen ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-container"}`}
              >
                <span className="material-symbols-outlined">search</span>
              </button>

              {isMobileSearchOpen && (
                <div className="fixed top-16 left-0 right-0 px-4 z-[100] md:hidden pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="mx-auto max-w-[400px] pointer-events-auto bg-surface-container-high p-2 rounded-2xl shadow-2xl border border-outline-variant/20 backdrop-blur-2xl">
                    <ClienteSearchBar variant="navbar" />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative text-[#e5e2e1]/70 hover:bg-[#3a3939] p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#131313]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-12 right-0 w-72 bg-surface-container rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] border border-outline-variant/15 overflow-hidden z-[100] origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high">
                <h3 className="font-headline font-bold text-on-surface text-sm">
                  Notifications
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                  {unreadCount > 0 ? `${unreadCount} New` : "All caught up"}
                </span>
              </div>
              <div className="max-h-[280px] overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-on-surface-variant text-sm">
                    No hay notificaciones
                  </div>
                ) : (
                  notifications.map((n) => {
                    const meta = getNotificationMeta(n.type);
                    return (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-3 flex gap-3 hover:bg-surface-bright transition-colors cursor-pointer border-b border-outline-variant/15 ${
                          !n.read ? "bg-surface-container-high" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full bg-${meta.accentColor}/10 text-${meta.accentColor} flex items-center justify-center flex-shrink-0 text-sm`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {meta.icon}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-xs font-semibold text-on-surface">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-on-surface-variant line-clamp-1">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-on-surface-variant/60">
                            {formatNotificationTime(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="border-t border-outline-variant/20">
                <Link
                  to="/cliente/notifications"
                  className="block w-full py-2.5 text-center text-xs font-bold text-primary hover:bg-surface-bright transition-all"
                  onClick={() => setIsNotifOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Botón Perfil */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:bg-surface-container p-1 pr-4 rounded-full transition-colors border border-outline-variant/10"
          >
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-primary">
              {displayName ? getInitials(displayName) : ""}
            </div>
            <span className="text-sm font-semibold text-on-surface">
              Account
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute top-12 right-0 w-56 bg-surface-container rounded-lg shadow-2xl shadow-black/80 border border-outline-variant/10 overflow-hidden z-[100] origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-outline-variant/10 bg-surface-container-low">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
                  Authenticated Account
                </p>
                <p className="text-on-surface font-headline font-extrabold text-sm">
                  {displayName}
                </p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-3 py-2 hover:bg-surface-bright rounded-lg transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">
                      person
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-on-surface">
                      My Profile
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-3 py-2 hover:bg-error/10 rounded-lg transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-error group-hover:bg-error group-hover:text-on-error transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">
                      logout
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-on-surface">
                      Cerrar sesión
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isSettingsOpen &&
        createPortal(
          <ClienteSettingsModal onClose={() => setIsSettingsOpen(false)} />,
          document.body,
        )}
    </header>
  );
}

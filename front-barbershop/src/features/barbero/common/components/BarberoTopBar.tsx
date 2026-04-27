import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import BarberoSettingsModal from "./BarberoSettingsModal";
import { useAuthStore } from "../../../auth/authStore";
import { useNotificationBell } from "../../../../hooks/useNotificationBell";
import {
  getNotificationMeta,
  formatNotificationTime,
} from "../../../../utils/notificationMapper";

export default function BarberoTopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full h-16 flex justify-end items-center pl-16 lg:pl-4 pr-4 md:pr-8 bg-[#131313] sticky top-0 z-40 border-b border-outline-variant/10">
        <div className="flex items-center gap-4 relative">
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {/* Campana */}
            <button
              className="relative text-[#e5e2e1]/70 hover:bg-[#3a3939] p-2 rounded-full transition-colors"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#131313]" />
              )}
            </button>

            {/* Dropdown Notificaciones */}
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 w-72 bg-surface-container rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] border border-outline-variant/15 overflow-hidden z-[100] origin-top-right animate-in fade-in zoom-in-95 duration-200">
                {/* Header del dropdown */}
                <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high">
                  <h3 className="font-headline font-bold text-on-surface">
                    Notifications
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                    {unreadCount > 0 ? `${unreadCount} New` : "All caught up"}
                  </span>
                </div>

                {/* Lista */}
                <div className="max-h-[260px] overflow-y-auto no-scrollbar">
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
                          className={`p-4 flex gap-4 hover:bg-surface-bright transition-colors cursor-pointer border-b border-outline-variant/15 ${
                            !n.read ? "bg-surface-container-high" : ""
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full bg-${meta.accentColor}/10 flex items-center justify-center shrink-0`}
                          >
                            <span
                              className={`material-symbols-outlined text-${meta.accentColor} text-lg`}
                            >
                              {meta.icon}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 min-w-0">
                            <p className="text-sm font-semibold text-on-surface">
                              {n.title}
                            </p>
                            <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-on-surface-variant/60 mt-1">
                              {formatNotificationTime(n.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <Link
                  to="/barbero/notifications"
                  className="block w-full py-3 text-center text-sm font-bold text-primary hover:bg-surface-bright transition-all border-t border-outline-variant/20"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>

          {/* Perfil / Avatar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-surface-container-highest border border-primary/20 flex items-center justify-center text-xs font-bold text-primary hover:border-primary/60 transition-all"
            >
              {displayName ? getInitials(displayName) : ""}
            </button>

            {isProfileOpen && (
              <div className="absolute top-12 right-0 w-56 bg-surface-container rounded-lg shadow-2xl shadow-black/80 border border-outline-variant/10 overflow-hidden z-[100] origin-top-right animate-in fade-in zoom-in-95 duration-200">
                {/* Header del dropdown */}
                <div className="p-3 border-b border-outline-variant/10 bg-surface-container-low">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
                    Authenticated Account
                  </p>
                  <p className="text-on-surface font-headline font-extrabold text-sm">
                    {displayName}
                  </p>
                </div>

                {/* Actions */}
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
                        settings
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-on-surface">
                        Settings
                      </p>
                    </div>
                  </button>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-outline-variant/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-3 py-2 hover:bg-error-container/20 rounded-lg transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-error/60 group-hover:text-error transition-colors flex-shrink-0">
                      <span className="material-symbols-outlined text-sm">
                        logout
                      </span>
                    </div>
                    <p className="text-xs font-bold text-error/60 group-hover:text-error transition-colors">
                      Logout
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {isSettingsOpen && (
        <BarberoSettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  );
}

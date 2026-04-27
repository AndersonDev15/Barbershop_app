import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../auth/authStore";
import Avatar from "../../../../components/ui/Avatar";
import ProfileDropdown from "./ProfileDropdown";
import SettingsModal from "./SettingsModal";
import { useNotificationBell } from "../../../../hooks/useNotificationBell";
import {
  getNotificationMeta,
  formatNotificationTime,
} from "../../../../utils/notificationMapper";

interface TopbarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  pageTitle?: string;
}

export default function Topbar({
  isOpen = false,
  onToggle = () => {},
  pageTitle = "Dashboard",
}: TopbarProps) {
  const { user } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<
    "shop" | "gallery" | "privacy"
  >("shop");

  const notifRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead } = useNotificationBell();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <header className="bg-[#131313]/80 backdrop-blur-xl h-20 w-full z-40 flex items-center justify-between px-4 md:px-8 font-['Inter'] text-sm border-b border-white/5">
        <div className="flex items-center gap-3 text-[#d0c5af]">
          <button
            onClick={onToggle}
            className="lg:hidden p-2 -ml-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            {isOpen ? (
              <span className="material-symbols-outlined text-[#f2ca50]">
                close
              </span>
            ) : (
              <span className="material-symbols-outlined text-[#f2ca50]">
                menu
              </span>
            )}
          </button>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[#e5e2e1]/40">Dashboard</span>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-[#e5e2e1] font-semibold">{pageTitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="hover:bg-[#2a2a2a] rounded-full p-2 transition-colors relative text-[#e5e2e1]/60 hover:text-[#e5e2e1]"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#f2ca50] rounded-full"></span>
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
                          <div className="flex flex-col gap-0.5 min-w-0 text-left">
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
                    to="/barberia/notifications"
                    className="block w-full py-2.5 text-center text-xs font-bold text-primary hover:bg-surface-bright transition-all"
                    onClick={() => setIsNotifOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative profile-dropdown-container">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`
                relative flex items-center justify-center rounded-full transition-all duration-300 profile-dropdown-trigger
                ${isProfileOpen ? "ring-2 ring-[#f2ca50] ring-offset-2 ring-offset-[#131313]" : "hover:ring-2 hover:ring-[#f2ca50]/50 hover:ring-offset-2 hover:ring-offset-[#131313]"}
              `}
            >
              <Avatar
                name={user?.name ?? "Admin"}
                size="md"
                src={user?.coverImageUrl}
              />
              <span
                className={`
                absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#131313] transition-all duration-300
                ${isProfileOpen ? "bg-[#f2ca50] scale-110 shadow-[0_0_10px_rgba(242,202,80,0.5)]" : "bg-green-500"}
              `}
              ></span>
            </button>

            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              user={
                user
                  ? {
                      name: user.name,
                      roles: user.roles,
                      coverImageUrl: user.coverImageUrl,
                    }
                  : null
              }
              onLogout={handleLogout}
              onOpenSettings={(section) => {
                setSettingsSection(section);
                setIsSettingsOpen(true);
              }}
            />
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialSection={settingsSection}
      />
    </>
  );
}

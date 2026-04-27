import React, { useRef, useEffect } from "react";
import Avatar from "../../../../components/ui/Avatar";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    roles?: string[];
    coverImageUrl?: string;
  } | null;
  onLogout: () => void;
  onOpenSettings: (section: "shop" | "gallery" | "privacy") => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenSettings,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !target.closest(".profile-dropdown-trigger")
      ) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const role = user?.roles?.[0]?.replace("ROLE_", "") ?? "Admin";

  return (
    <div
      ref={dropdownRef}
      style={{
        animation:
          "profileDropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
      className="
        absolute right-0 top-full mt-2 w-64
        bg-[#1c1b1b]/95 backdrop-blur-xl
        border border-white/10
        rounded-xl shadow-[0px_18px_36px_rgba(0,0,0,0.7)]
        z-50 overflow-hidden font-['Inter']
      "
    >
      <style>{`
        @keyframes profileDropdownFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* HEADER */}
      <div className="p-4 border-b border-white/5">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#f2ca50] mb-2">
          Account
        </p>

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
            <span className="text-[11px] text-[#d0c5af]/60">
              {role === "Admin" ? "Master Barber / Owner" : role}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="p-2 space-y-1">
        <button
          onClick={() => {
            onClose();
            onOpenSettings("shop");
          }}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d0c5af] text-lg">
              person
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#e5e2e1]">
              Profile
            </span>
            <span className="text-[10px] text-[#d0c5af]/50">View details</span>
          </div>
        </button>

        <button
          onClick={() => {
            onClose();
            onOpenSettings("privacy");
          }}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d0c5af] text-lg">
              settings
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#e5e2e1]">
              Settings
            </span>
            <span className="text-[10px] text-[#d0c5af]/50">Preferences</span>
          </div>
        </button>
      </div>

      {/* FOOTER */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/10 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-400 text-lg">
              logout
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-red-400">Sign out</span>
            <span className="text-[10px] text-red-400/50">End session</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;

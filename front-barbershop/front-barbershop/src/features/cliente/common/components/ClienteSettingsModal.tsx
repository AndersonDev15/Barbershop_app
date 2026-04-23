import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../../auth/authStore";
import api from "../../../../lib/api";

interface ClienteSettingsModalProps {
  onClose: () => void;
}

type ClienteSettingsTab = "account" | "privacy";

export default function ClienteSettingsModal({
  onClose,
}: ClienteSettingsModalProps) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ClienteSettingsTab>("account");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState(user?.given_name ?? "");
  const [lastName, setLastName] = useState(user?.family_name ?? "");
  const [phone, setPhone] = useState(user?.phone_number ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  function handleTabChange(tab: ClienteSettingsTab) {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  }

  const handleSaveAccount = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await api.put("/api/users/me", { firstName, lastName, phone });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(
        err.response?.data?.message ?? "Error al guardar los cambios",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await api.patch("/api/auth/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message ?? "Error al cambiar la contraseña",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-8">
      <div
        ref={modalRef}
        className="w-full max-w-3xl bg-surface-container rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[85vh] max-h-[700px] relative"
      >
        {/* Overlay mobile para cerrar sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          absolute md:relative top-0 left-0 h-full w-60 bg-surface-container-lowest 
          flex flex-col p-5 border-r border-white/5 z-20 
          transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
        `}
        >
          {/* Avatar + info */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-surface-container-high border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
              {`${user?.given_name?.[0] ?? ""}${user?.family_name?.[0] ?? ""}`.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface leading-tight">
                {user?.name ?? ""}
              </p>
              <p className="text-[10px] font-medium text-primary tracking-widest uppercase">
                Client
              </p>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="space-y-1">
            <button
              onClick={() => handleTabChange("account")}
              className={`w-full text-left px-4 py-3 rounded-full flex items-center gap-3 transition-all text-xs font-semibold uppercase tracking-wider ${
                activeTab === "account"
                  ? "bg-surface-container-highest text-primary"
                  : "text-on-surface/50 hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-sm">person</span>
              Account
            </button>
            <button
              onClick={() => handleTabChange("privacy")}
              className={`w-full text-left px-4 py-3 rounded-full flex items-center gap-3 transition-all text-xs font-semibold uppercase tracking-wider ${
                activeTab === "privacy"
                  ? "bg-surface-container-highest text-primary"
                  : "text-on-surface/50 hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                security
              </span>
              Privacy
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">
          {/* Header sticky */}
          <header className="px-5 md:px-8 pt-5 pb-4 flex justify-between items-start sticky top-0 bg-surface-container z-10 border-b border-white/5">
            <div className="flex items-center gap-3">
              {/* Hamburguesa mobile */}
              <button
                className="md:hidden p-1.5 rounded-full hover:bg-surface-container-highest text-on-surface/60 hover:text-on-surface transition-all"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                <span className="material-symbols-outlined text-lg">
                  {isSidebarOpen ? "close" : "menu"}
                </span>
              </button>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] block">
                  Settings
                </span>
                <h2 className="text-xl md:text-2xl font-headline font-extrabold tracking-tighter text-on-surface">
                  {activeTab === "account"
                    ? "Account Settings"
                    : "Privacy & Security"}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container-highest text-on-surface/40 hover:text-on-surface transition-all flex-shrink-0"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </header>

          {/* Body scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0 px-5 md:px-8 py-6 space-y-6 custom-scrollbar">
            {activeTab === "account" && (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 whitespace-nowrap">
                    Personal Information
                  </h3>
                  <div className="h-px flex-1 bg-outline-variant/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      First Name
                    </label>
                    <input
                      className="bg-surface-container-high border-none rounded-full px-5 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Last Name
                    </label>
                    <input
                      className="bg-surface-container-high border-none rounded-full px-5 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Phone Number
                    </label>
                    <input
                      className="bg-surface-container-high border-none rounded-full px-5 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2 opacity-60">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Email (Read-only)
                    </label>
                    <div className="bg-surface-container-lowest rounded-full px-5 py-3 text-on-surface/50 text-sm flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="material-symbols-outlined text-sm flex-shrink-0">
                        lock
                      </span>
                      <span className="truncate">{user?.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-60">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Role (Read-only)
                    </label>
                    <div className="bg-surface-container-lowest rounded-full px-5 py-3 text-on-surface/50 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm flex-shrink-0">
                        badge
                      </span>
                      Client
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {saveError && (
                    <p className="text-error text-xs px-1 font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                      {saveError}
                    </p>
                  )}
                  {saveSuccess && (
                    <p className="text-tertiary text-xs px-1 font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                      Cambios guardados correctamente
                    </p>
                  )}
                </div>
              </>
            )}

            {activeTab === "privacy" && (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 whitespace-nowrap">
                    Change Password
                  </h3>
                  <div className="h-px flex-1 bg-outline-variant/10" />
                </div>

                {user?.isGoogleUser ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                      lock
                    </span>
                    <p className="text-on-surface font-bold">
                      Tu cuenta está vinculada con Google
                    </p>
                    <p className="text-on-surface-variant text-sm max-w-xs">
                      El cambio de contraseña se gestiona desde tu cuenta de
                      Google.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-surface-container-high border-none rounded-full px-5 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none pr-12"
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          onClick={() => setShowCurrent((p) => !p)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            {showCurrent ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-surface-container-high border-none rounded-full px-5 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none pr-12"
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          onClick={() => setShowNew((p) => !p)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            {showNew ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-surface-container-high border-none rounded-full px-5 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none pr-12"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          onClick={() => setShowConfirm((p) => !p)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            {showConfirm ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  {passwordError && (
                    <p className="text-error text-xs px-1 font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                      {passwordError}
                    </p>
                  )}
                  {passwordSuccess && (
                    <p className="text-tertiary text-xs px-1 font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                      Contraseña actualizada correctamente
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="px-5 md:px-8 py-4 bg-surface-container-lowest border-t border-white/5 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-on-surface/60 font-bold text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-all"
            >
              Cancel
            </button>
            <button
              onClick={
                activeTab === "account"
                  ? handleSaveAccount
                  : handleChangePassword
              }
              disabled={isSaving || isChangingPassword}
              className="px-7 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/10 hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving || isChangingPassword ? "Guardando..." : "Save Changes"}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import api from "../../../../lib/api";
interface BarberoSettingsModalProps {
  onClose: () => void;
}

type SettingsTab = "account" | "security";

export default function BarberoSettingsModal({
  onClose,
}: BarberoSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Account fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [commission, setCommission] = useState(0);
  const [barberShopName, setBarberShopName] = useState("");

  // Security fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/barber/profile")
      .then((res) => {
        const data = res.data;
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhone(data.phone || "");
        setDocumentNumber(data.documentNumber);
        setCommission(data.commission);
        setBarberShopName(data.barberShopName);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("Could not load profile data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put("/api/users/me", {
        firstName,
        lastName,
        phone,
      });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.patch("/api/auth/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Error changing password. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  function handleTabChange(tab: SettingsTab) {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      {/* Modal */}
      <div
        ref={modalRef}
        className="w-full max-w-3xl bg-surface-container-lowest rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[85vh] relative"
      >
        {/* Sidebar overlay en mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            absolute md:relative top-0 left-0 h-full w-64 md:w-60 bg-surface-container-lowest 
            flex flex-col p-6 border-r border-white/5 z-20 
            transition-transform duration-300 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0
          `}
        >
          {/* Avatar + nombre */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-surface-container-high border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
              {firstName?.[0]}
              {lastName?.[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface leading-tight">
                {firstName} {lastName}
              </p>
              <p className="text-[10px] font-medium text-primary tracking-widest uppercase">
                Barber
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
              onClick={() => handleTabChange("security")}
              className={`w-full text-left px-4 py-3 rounded-full flex items-center gap-3 transition-all text-xs font-semibold uppercase tracking-wider ${
                activeTab === "security"
                  ? "bg-surface-container-highest text-primary"
                  : "text-on-surface/50 hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                security
              </span>
              Security
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="px-6 md:px-10 pt-6 pb-4 flex justify-between items-start sticky top-0 bg-surface-container-lowest z-10 border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              {/* Botón hamburguesa — solo mobile */}
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
                <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface">
                  {activeTab === "account" ? "Account Settings" : "Security"}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container-highest text-on-surface/40 hover:text-on-surface transition-all flex-shrink-0"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-8 no-scrollbar">
            {error && (
              <div className="bg-error-container/10 border border-error/20 text-error text-xs p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}
            {success && (
              <div className="bg-primary/10 border border-primary/20 text-primary text-xs p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
                {success}
              </div>
            )}

            {activeTab === "account" && (
              <>
                {/* Section divider */}
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 whitespace-nowrap">
                    Personal Information
                  </h3>
                  <div className="h-px flex-1 bg-outline-variant/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      First Name
                    </label>
                    <input
                      className="bg-surface-container-high border-none rounded-full px-5 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                    />
                  </div>
                  {/* Last Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Last Name
                    </label>
                    <input
                      className="bg-surface-container-high border-none rounded-full px-5 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                    />
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Phone Number
                    </label>
                    <input
                      className="bg-surface-container-high border-none rounded-full px-5 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                    />
                  </div>
                  {/* Email (read-only) */}
                  <div className="flex flex-col gap-2 opacity-60">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Email Address (Read-only)
                    </label>
                    <div className="bg-surface-container rounded-full px-5 py-3.5 text-on-surface/50 text-sm flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="material-symbols-outlined text-sm flex-shrink-0">
                        lock
                      </span>
                      <span className="truncate">{email}</span>
                    </div>
                  </div>
                  {/* Document (read-only) */}
                  <div className="flex flex-col gap-2 opacity-60">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Document Number (Read-only)
                    </label>
                    <div className="bg-surface-container rounded-full px-5 py-3.5 text-on-surface/50 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        badge
                      </span>
                      {documentNumber}
                    </div>
                  </div>
                  {/* Commission (read-only) */}
                  <div className="flex flex-col gap-2 opacity-60">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Commission (Read-only)
                    </label>
                    <div className="bg-surface-container rounded-full px-5 py-3.5 text-on-surface/50 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        payments
                      </span>
                      {commission}%
                    </div>
                  </div>
                  {/* Barbershop (read-only) */}
                  <div className="flex flex-col gap-2 opacity-60">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Barbershop (Read-only)
                    </label>
                    <div className="bg-surface-container rounded-full px-5 py-3.5 text-on-surface/50 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        storefront
                      </span>
                      {barberShopName}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="bg-primary text-on-primary font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    )}
                    Save Changes
                  </button>
                </div>
              </>
            )}

            {activeTab === "security" && (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 whitespace-nowrap">
                    Change Password
                  </h3>
                  <div className="h-px flex-1 bg-outline-variant/10" />
                </div>

                <div className="space-y-5 max-w-md">
                  {/* Current Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-high border-none rounded-full px-5 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none pr-12"
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        onClick={() => setShowCurrent((p) => !p)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showCurrent ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* New Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-high border-none rounded-full px-5 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none pr-12"
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        onClick={() => setShowNew((p) => !p)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showNew ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* Confirm Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 px-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-high border-none rounded-full px-5 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary/30 transition-all outline-none pr-12"
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        onClick={() => setShowConfirm((p) => !p)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showConfirm ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="bg-primary text-on-primary font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading && (
                        <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                      )}
                      Change Password
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

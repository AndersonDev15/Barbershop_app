import React, { useState, useEffect } from "react";
import api from "../../../../lib/api";
import type { InvitationStatus, BarberInvitationResponse } from "../../types/barbers.types";

interface AddBarberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    documentNumber: string;
    commission: number;
  }) => void;
}

const AddBarberModal: React.FC<AddBarberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<"invite" | "pending">("invite");

  // Invite form state
  const [email, setEmail] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [commission, setCommission] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Invitations list state
  const [invitations, setInvitations] = useState<BarberInvitationResponse[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [invitationsError, setInvitationsError] = useState<string | null>(null);
  const [cancelingToken, setCancelingToken] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setDocumentNumber("");
      setCommission(60);
      setError(null);
      setIsLoading(false);
      setActiveTab("invite");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === "pending") {
      fetchInvitations();
    }
  }, [isOpen, activeTab]);

  const fetchInvitations = async () => {
    setIsLoadingInvitations(true);
    setInvitationsError(null);
    try {
      const response = await api.get<BarberInvitationResponse[]>(
        "/api/barbershop/invitations"
      );
      setInvitations(response.data);
    } catch (err: any) {
      console.error("Error fetching invitations:", err);
      setInvitationsError(
        err.response?.data?.message ||
          "Failed to load invitations. Please try again."
      );
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleInvite = async () => {
    if (!email.trim() || !documentNumber.trim()) {
      setError("Email and document number are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post("/api/barbershop/invitations", {
        email,
        documentNumber,
        commission: commission / 100,
      });
      onSubmit({ email, documentNumber, commission });
      onClose();
    } catch (err: any) {
      console.error("Error sending invitation:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send invitation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvitation = async (token: string) => {
    setCancelingToken(token);
    try {
      await api.delete(`/api/barbershop/invitations/${token}`);
      fetchInvitations();
    } catch (err) {
      console.error("Error canceling invitation:", err);
    } finally {
      setCancelingToken(null);
    }
  };

  const getStatusBadge = (status: InvitationStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20">
            Pending
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20">
            Accepted
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#9ca3af]/10 text-[#9ca3af] border border-[#9ca3af]/20">
            Expired
          </span>
        );
      case "CANCELED":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20">
            Canceled
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md max-h-[90vh] bg-[#0e0e0e] rounded-xl border border-white/5 shadow-2xl mx-4 flex flex-col overflow-hidden">
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f2ca50] to-[#d4af37]" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-[#353534] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#f2ca50]">
                person_add
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#f2ca50]">
              Administration
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#e5e2e1] font-['Manrope']">
            Add New Barber
          </h2>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-[#131313] p-1.5 rounded-xl">
            <button
              onClick={() => setActiveTab("invite")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeTab === "invite"
                  ? "bg-[#2a2a2a] text-[#f2ca50]"
                  : "text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              Invite
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeTab === "pending"
                  ? "bg-[#2a2a2a] text-[#f2ca50]"
                  : "text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Body (SCROLLABLE) */}
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {activeTab === "invite" ? (
            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#d0c5af]">
                    Email Address
                  </label>
                  <span className="text-[10px] text-[#3de1fc] font-bold uppercase tracking-widest">
                    Required
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#d0c5af] group-focus-within:text-[#f2ca50] transition-colors">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#201f1f] text-[#e5e2e1] py-3 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-[#f2ca50]/30 placeholder:text-[#d0c5af]/30 transition-all outline-none"
                    placeholder="barber@latherandlead.com"
                  />
                </div>
              </div>

              {/* Document Number Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#d0c5af]">
                    Document Number
                  </label>
                  <span className="text-[10px] text-[#3de1fc] font-bold uppercase tracking-widest">
                    Required
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#d0c5af] group-focus-within:text-[#f2ca50] transition-colors">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full bg-[#201f1f] text-[#e5e2e1] py-3 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-[#f2ca50]/30 placeholder:text-[#d0c5af]/30 transition-all outline-none"
                    placeholder="ID or passport number"
                  />
                </div>
              </div>

              {/* Commission Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#d0c5af]">
                  Commission Rate
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#d0c5af] group-focus-within:text-[#f2ca50] transition-colors">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className="w-full bg-[#201f1f] text-[#e5e2e1] py-3 pl-12 pr-12 rounded-xl focus:ring-2 focus:ring-[#f2ca50]/30 transition-all outline-none"
                    placeholder="60"
                  />
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#d0c5af] font-bold">
                    %
                  </div>
                </div>
                <p className="text-[11px] text-[#d0c5af]/60 italic">
                  The percentage of service revenue the barber receives per
                  transaction.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-400 text-xs text-center py-2">{error}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isLoadingInvitations ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <span className="material-symbols-outlined text-5xl text-[#f2ca50] animate-spin">
                    progress_activity
                  </span>
                  <p className="text-[#99907c] text-xs font-bold uppercase tracking-widest">
                    Loading invitations...
                  </p>
                </div>
              ) : invitationsError ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <span className="material-symbols-outlined text-5xl text-red-400">
                    error
                  </span>
                  <p className="text-red-400 text-xs text-center">{invitationsError}</p>
                  <button
                    onClick={fetchInvitations}
                    className="px-4 py-2 bg-[#2a2a2a] text-[#f2ca50] text-xs font-bold rounded-lg hover:bg-[#353535] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : invitations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <span className="material-symbols-outlined text-6xl text-[#f2ca50]">
                    mail
                  </span>
                  <p className="text-[#99907c] text-sm font-medium">
                    No pending invitations
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.token}
                      className="bg-[#131313] rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="font-bold text-[#e5e2e1] text-sm truncate">
                          {invitation.invitedEmail}
                        </span>
                        <span className="text-xs text-[#99907c]">
                          Expires:{" "}
                          {new Date(invitation.expiresAt).toLocaleDateString(
                            "es-CO",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <div className="mt-1">{getStatusBadge(invitation.status)}</div>
                      </div>
                      {invitation.status === "PENDING" && (
                        <button
                          onClick={() => handleCancelInvitation(invitation.token)}
                          disabled={cancelingToken === invitation.token}
                          title="Cancel invitation"
                          className="p-2 text-[#99907c] hover:text-red-400 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <span className="material-symbols-outlined">
                            {cancelingToken === invitation.token ? (
                              <span className="animate-spin">progress_activity</span>
                            ) : (
                              "cancel"
                            )}
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === "invite" && (
          <div className="px-6 pb-6 pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleInvite}
              disabled={isLoading}
              className="flex-1 py-3 rounded-full bg-[#f2ca50] text-[#3c2f00] font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  Send Invitation
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-[#353534] text-[#e5e2e1] font-semibold hover:bg-[#3a3939] active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBarberModal;

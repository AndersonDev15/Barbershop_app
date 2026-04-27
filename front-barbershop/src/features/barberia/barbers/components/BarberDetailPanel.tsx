import React from "react";
import type { BarberStatus } from "../../types/barbers.types";

export interface BarberDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  barber: {
    barberId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentNumber: string;
    commission: number;
    status: BarberStatus;
  } | null;
}

const BarberDetailPanel: React.FC<BarberDetailPanelProps> = ({
  isOpen,
  onClose,
  barber,
}) => {
  if (!isOpen || !barber) return null;

  const fullName = `${barber.firstName} ${barber.lastName}`;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStatus = (status: BarberStatus) => {
    switch (status) {
      case "ACTIVO":
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
            <span className="text-sm font-bold text-[#4ade80]">Active</span>
          </div>
        );
      case "VACACIONES":
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#facc15]" />
            <span className="text-sm font-bold text-[#facc15]">
              On Vacation
            </span>
          </div>
        );
      case "INACTIVO":
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#9ca3af]" />
            <span className="text-sm font-bold text-[#9ca3af]">Inactive</span>
          </div>
        );
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-lg bg-[#0e0e0e] shadow-[0px_24px_48px_rgba(0,0,0,0.5)] z-[70] flex flex-col border-l border-white/5 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <span className="text-xs font-bold text-[#d0c5af] uppercase tracking-[0.25em]">
              Barber Profile
            </span>
            <h2 className="text-2xl font-['Manrope'] font-extrabold text-[#e5e2e1] mt-1">
              {fullName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="bg-[#201f1f] hover:bg-[#3a3939] text-[#e5e2e1] p-2.5 rounded-full transition-all active:scale-95 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Identity */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg bg-[#201f1f] border-2 border-[#f2ca50]/20 flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-extrabold text-[#f2ca50]">
                  {getInitials(fullName)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[#d0c5af] flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-sm">mail</span>
                {barber.email}
              </div>
              <div className="text-[#d0c5af] flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-sm">badge</span>
                Doc: {barber.documentNumber}
              </div>
              <div className="text-[#d0c5af] flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-sm">
                  fingerprint
                </span>
                ID: {barber.barberId}
              </div>
              <div>{renderStatus(barber.status)}</div>
              <div className="text-[#f2ca50] flex items-center gap-2 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">call</span>
                {barber.phone}
              </div>
            </div>
          </div>

          {/* Commission */}
          <div className="bg-[#131313] rounded-lg p-6 relative overflow-hidden border border-white/5">
            <span className="material-symbols-outlined absolute top-3 right-3 text-6xl opacity-5 text-[#f2ca50]">
              payments
            </span>
            <span className="text-[10px] font-bold text-[#d0c5af] uppercase tracking-[0.3em] mb-3 block">
              Commission Model
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-['Manrope'] font-extrabold text-[#f2ca50]">
                {(barber.commission * 100).toFixed(0)}%
              </span>
              <span className="text-[#d0c5af] text-sm font-medium">
                Payout rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarberDetailPanel;

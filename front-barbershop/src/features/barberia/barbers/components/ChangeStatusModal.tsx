import React, { useState, useEffect } from "react";
import type { BarberStatus } from "../../types/barbers.types";

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: BarberStatus;
  barberName: string;
  onConfirm: (newStatus: BarberStatus) => void;
  isLoading?: boolean;
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  barberName,
  onConfirm,
  isLoading = false,
}) => {
  const [selected, setSelected] = useState<BarberStatus>(currentStatus);

  useEffect(() => {
    if (isOpen) {
      setSelected(currentStatus);
    }
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  const renderBadge = (status: BarberStatus) => {
    switch (status) {
      case "ACTIVO":
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#353534] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]"></div>
            <span className="text-sm font-bold text-[#4ade80]">Active</span>
          </div>
        );
      case "VACACIONES":
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#353534] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#facc15]"></div>
            <span className="text-sm font-bold text-[#facc15]">
              On Vacation
            </span>
          </div>
        );
      case "INACTIVO":
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#353534] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#9ca3af]"></div>
            <span className="text-sm font-bold text-[#9ca3af]">Inactive</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-md max-h-[90vh] flex flex-col bg-[#1c1b1b] rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-['Manrope'] text-[#e5e2e1]">
              Change Status
            </h2>
            <p className="text-sm text-[#d0c5af] mt-1">{barberName}</p>
          </div>

          <button
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="text-[#d0c5af] hover:bg-[#2a2a2a] p-2 rounded-full transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-4 space-y-8 overflow-y-auto">
          {/* Current Status pill */}
          <div className="flex items-center justify-between p-4 bg-[#0e0e0e] rounded-lg">
            <span className="text-sm font-medium text-[#d0c5af] uppercase tracking-widest">
              Current Status
            </span>
            {renderBadge(currentStatus)}
          </div>

          {/* Choose New Status */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#d0c5af] uppercase tracking-[0.15em] ml-1">
              Choose New Status
            </label>

            {/* Active */}
            <div
              onClick={() => !isLoading && setSelected("ACTIVO")}
              className={`flex items-center p-4 bg-[#2a2a2a] rounded-lg cursor-pointer border transition-all active:scale-[0.98] ${
                isLoading ? "opacity-50 pointer-events-none" : ""
              } ${
                selected === "ACTIVO"
                  ? "border-[#f2ca50]"
                  : "border-transparent hover:border-[#f2ca50]/20"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#4ade80]/10 flex items-center justify-center mr-4">
                <span className="material-symbols-outlined text-[#4ade80]">
                  check_circle
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#e5e2e1]">Active</p>
                <p className="text-xs text-[#d0c5af]">
                  Available for client bookings
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === "ACTIVO"
                    ? "border-[#f2ca50] bg-[#f2ca50]"
                    : "border-[#4d4635]"
                }`}
              >
                {selected === "ACTIVO" && (
                  <div className="w-2 h-2 bg-[#3c2f00] rounded-full"></div>
                )}
              </div>
            </div>

            {/* On Vacation */}
            <div
              onClick={() => !isLoading && setSelected("VACACIONES")}
              className={`flex items-center p-4 bg-[#2a2a2a] rounded-lg cursor-pointer border transition-all active:scale-[0.98] ${
                isLoading ? "opacity-50 pointer-events-none" : ""
              } ${
                selected === "VACACIONES"
                  ? "border-[#f2ca50]"
                  : "border-transparent hover:border-[#f2ca50]/20"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#facc15]/10 flex items-center justify-center mr-4">
                <span className="material-symbols-outlined text-[#facc15]">
                  beach_access
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#e5e2e1]">On Vacation</p>
                <p className="text-xs text-[#d0c5af]">
                  Temporarily blocking new slots
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === "VACACIONES"
                    ? "border-[#f2ca50] bg-[#f2ca50]"
                    : "border-[#4d4635]"
                }`}
              >
                {selected === "VACACIONES" && (
                  <div className="w-2 h-2 bg-[#3c2f00] rounded-full"></div>
                )}
              </div>
            </div>

            {/* Inactive */}
            <div
              onClick={() => !isLoading && setSelected("INACTIVO")}
              className={`flex items-center p-4 bg-[#2a2a2a] rounded-lg cursor-pointer border transition-all active:scale-[0.98] ${
                isLoading ? "opacity-50 pointer-events-none" : ""
              } ${
                selected === "INACTIVO"
                  ? "border-[#f2ca50]"
                  : "border-transparent hover:border-[#f2ca50]/20"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#9ca3af]/10 flex items-center justify-center mr-4">
                <span className="material-symbols-outlined text-[#9ca3af]">
                  do_not_disturb_on
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#e5e2e1]">Inactive</p>
                <p className="text-xs text-[#d0c5af]">
                  Hide profile from public list
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === "INACTIVO"
                    ? "border-[#f2ca50] bg-[#f2ca50]"
                    : "border-[#4d4635]"
                }`}
              >
                {selected === "INACTIVO" && (
                  <div className="w-2 h-2 bg-[#3c2f00] rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 mt-auto flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-4 rounded-full font-bold text-[#e5e2e1] bg-[#2a2a2a] hover:bg-[#353534] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="flex-1 px-6 py-4 rounded-full font-bold text-[#3c2f00] bg-[#f2ca50] hover:shadow-[0_0_20px_rgba(242,202,80,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            disabled={selected === currentStatus || isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
                Updating...
              </>
            ) : (
              "Confirm Change"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusModal;

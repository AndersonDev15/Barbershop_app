import React, { useState, useEffect } from "react";

interface EditCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  barberName: string;
  barberRole: string;
  currentCommission: number;
  onSave: (newCommission: number) => void;
  isLoading?: boolean;
}

const EditCommissionModal: React.FC<EditCommissionModalProps> = ({
  isOpen,
  onClose,
  barberName,
  barberRole,
  currentCommission,
  onSave,
  isLoading = false,
}) => {
  const [commission, setCommission] = useState(currentCommission);

  useEffect(() => {
    if (isOpen) {
      setCommission(currentCommission);
    }
  }, [isOpen, currentCommission]);

  if (!isOpen) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-[#1c1b1b] rounded-lg overflow-hidden border border-white/5 shadow-[0_0_20px_rgba(242,202,80,0.15)]">
        {/* Header */}
        <div className="p-6 pb-3 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#e5e2e1] font-['Manrope']">
              Edit Commission
            </h2>
            <p className="text-xs text-[#d0c5af] font-medium uppercase tracking-widest mt-1">
              Financial Settings
            </p>
          </div>
          <button
            onClick={() => !isLoading && onClose()}
            className="text-[#d0c5af] hover:text-[#e5e2e1] transition-colors"
            disabled={isLoading}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-0 space-y-5">
          {/* Barber Profile (read-only) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]/80 block">
              Barber Profile
            </label>
            <div className="flex items-center gap-3 bg-[#2a2a2a] p-4 rounded-lg border border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#3a3939] border-2 border-[#f2ca50]/20 flex items-center justify-center overflow-hidden">
                <span className="text-sm font-bold text-[#f2ca50]">
                  {getInitials(barberName)}
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-[#e5e2e1] leading-tight">
                  {barberName}
                </p>
                <p className="text-xs text-[#d0c5af]">{barberRole}</p>
              </div>
              <div className="ml-auto px-2 py-0.5 rounded-full bg-[#3a3939] text-[10px] font-bold text-[#3de1fc] uppercase tracking-tighter">
                Read Only
              </div>
            </div>
          </div>

          {/* Commission Rate Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]/80">
                Commission Rate
              </label>
              <span className="text-[10px] text-[#d0c5af]">
                Standard range: 40% - 70%
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                onFocus={(e) => e.target.select()}
                disabled={isLoading}
                className="w-full bg-[#353534] border-none focus:ring-2 focus:ring-[#f2ca50]/50 rounded-lg py-4 px-5 text-xl font-['Manrope'] font-bold text-[#f2ca50] placeholder-[#d0c5af]/30 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50"
                placeholder="50"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-bold text-[#f2ca50]">
                %
              </span>
            </div>
          </div>

          {/* Info Note */}
          <div className="flex gap-3 p-3 rounded-lg bg-[#353534]/50 border border-white/5">
            <span className="material-symbols-outlined text-[#f2ca50] text-sm">
              info
            </span>
            <p className="text-xs text-[#d0c5af] leading-relaxed">
              Adjusting the commission rate will affect all future appointments
              for{" "}
              <span className="text-[#e5e2e1] font-semibold">{barberName}</span>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full bg-[#353534] text-[#e5e2e1] font-bold text-sm hover:bg-[#3a3939] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(commission)}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full bg-[#f2ca50] text-[#3c2f00] font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#f2ca50]/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* Decorative line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#f2ca50]/40 to-transparent"></div>
      </div>
    </div>
  );
};

export default EditCommissionModal;

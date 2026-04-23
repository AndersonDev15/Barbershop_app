import { useState } from "react";
import TimePickerModal from "../../../barberia/scheduled/components/TimePickerModal";

interface BarberoBlockAfternoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BarberoBlockAfternoonModal({
  isOpen,
  onClose,
  onConfirm,
}: BarberoBlockAfternoonModalProps) {
  const [blockFrom, setBlockFrom] = useState("02:00 PM");
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md bg-surface-container-low rounded-lg shadow-2xl border border-outline-variant/10 overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="px-8 pt-8 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary block mb-2">
                  Quick Action
                </span>
                <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">
                  Block Afternoon
                </h2>
              </div>
              <button
                onClick={onClose}
                className="mt-1 bg-surface-container-highest p-2 rounded-full text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </header>

          {/* Body */}
          <div className="px-8 py-4 space-y-6">
            {/* Info card */}
            <div className="flex items-start gap-4 p-4 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">bedtime</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                This will mark all remaining slots from 2:00 PM onwards as
                unavailable for today. Clients will not be able to book during
                this window.
              </p>
            </div>

            {/* Block from — botón que abre TimePicker */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
                Block from
              </label>
              <button
                onClick={() => setIsTimePickerOpen(true)}
                className="w-full flex items-center gap-3 bg-surface-container-high rounded-full py-3.5 pl-5 pr-5 hover:bg-surface-bright transition-all"
              >
                <span className="material-symbols-outlined text-tertiary text-sm cursor-pointer">
                  schedule
                </span>
                <span className="text-on-surface font-bold text-base flex-1 text-left">
                  {blockFrom}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-tertiary">
                info
              </span>
              <span>Existing confirmed bookings will not be affected.</span>
            </div>
          </div>

          {/* Footer */}
          <footer className="px-8 py-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-surface-bright active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm hover:bg-primary-container active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Block Afternoon
            </button>
          </footer>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </div>

      <TimePickerModal
        isOpen={isTimePickerOpen}
        type="open"
        day="Today"
        initialTime={blockFrom}
        onClose={() => setIsTimePickerOpen(false)}
        onSubmit={(time) => setBlockFrom(time)}
      />
    </>
  );
}

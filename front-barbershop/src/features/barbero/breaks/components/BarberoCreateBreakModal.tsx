import { useState } from "react";
import TimePickerModal from "../../../barberia/scheduled/components/TimePickerModal";

interface BarberoCreateBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
  }) => void;
}

export default function BarberoCreateBreakModal({
  isOpen,
  onClose,
  onSave,
}: BarberoCreateBreakModalProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("10:00 AM");
  const [reason, setReason] = useState("");
  const [whichTimePicker, setWhichTimePicker] = useState<
    "start" | "end" | null
  >(null);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md bg-surface-container-low rounded-lg shadow-2xl border border-outline-variant/10 overflow-hidden relative flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="px-8 pt-8 pb-4 shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary block mb-2">
                  Scheduling
                </span>
                <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">
                  Create Break
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

          {/* Body — scrollable si hace falta */}
          <div className="px-8 py-4 space-y-5 overflow-y-auto flex-1">
            {/* Future Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
                Future Date
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-container material-symbols-outlined text-sm">
                  calendar_today
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-high border-none rounded-full py-3.5 pl-12 pr-5 text-on-surface font-medium focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Start Time y End Time — botones que abren TimePicker */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
                  Start Time
                </label>
                <button
                  onClick={() => setWhichTimePicker("start")}
                  className="w-full flex items-center gap-2 bg-surface-container-high rounded-full py-3.5 pl-4 pr-4 hover:bg-surface-bright transition-all"
                >
                  <span className="material-symbols-outlined text-tertiary text-sm shrink-0">
                    schedule
                  </span>
                  <span className="text-on-surface font-bold text-sm flex-1 text-left truncate">
                    {startTime}
                  </span>
                </button>
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
                  End Time
                </label>
                <button
                  onClick={() => setWhichTimePicker("end")}
                  className="w-full flex items-center gap-2 bg-surface-container-high rounded-full py-3.5 pl-4 pr-4 hover:bg-surface-bright transition-all"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-sm shrink-0">
                    bedtime
                  </span>
                  <span className="text-on-surface font-bold text-sm flex-1 text-left truncate">
                    {endTime}
                  </span>
                </button>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
                Reason (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-container material-symbols-outlined text-sm">
                  coffee
                </span>
                <input
                  type="text"
                  placeholder="e.g., Quick espresso break"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-surface-container-high border-none rounded-full py-3.5 pl-12 pr-5 text-on-surface font-medium focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Nota */}
            <div className="flex items-start gap-3 p-4 bg-surface-container/50 rounded-lg">
              <span
                className="material-symbols-outlined text-tertiary-fixed-dim text-sm shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                info
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Setting a break will automatically block your calendar. Clients
                will not be able to book during this window.
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="px-8 py-5 flex gap-3 shrink-0 bg-surface-container-low">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-surface-bright active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ date, startTime, endTime, reason })}
              className="flex-1 py-3.5 rounded-full bg-primary text-on-primary font-bold text-sm hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              Save Break
            </button>
          </footer>

          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>

      {/* TimePicker compartido para start y end */}
      <TimePickerModal
        isOpen={whichTimePicker !== null}
        type="open"
        day="Break"
        initialTime={whichTimePicker === "start" ? startTime : endTime}
        onClose={() => setWhichTimePicker(null)}
        onSubmit={(time) => {
          if (whichTimePicker === "start") setStartTime(time);
          else setEndTime(time);
          setWhichTimePicker(null);
        }}
      />
    </>
  );
}

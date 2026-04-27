import React, { useState, useEffect } from "react";

interface TimePickerModalProps {
  isOpen: boolean;
  type: "open" | "close";
  day: string;
  initialTime: string;
  onClose: () => void;
  onSubmit: (time: string) => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  type,
  day,
  initialTime,
  onClose,
  onSubmit,
}) => {
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("PM");

  useEffect(() => {
    if (isOpen && initialTime) {
      try {
        const [timePart, ampm] = initialTime.split(" ");
        const [h, m] = timePart.split(":").map(Number);
        setHour(h || 7);
        setMinute(m || 0);
        setPeriod((ampm as "AM" | "PM") || "PM");
      } catch (e) {
        console.error("Error parsing initial time:", e);
      }
    }
  }, [isOpen, initialTime]);

  if (!isOpen) return null;

  const quickMinutes = [0, 15, 30, 45];

  const handleSetTime = () => {
    const formatted = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${period}`;
    onSubmit(formatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL CONTAINER (FIXED SIZE) */}
      <div className="relative w-[420px] max-w-[95vw] max-h-[85vh] bg-[#1c1b1b] rounded-lg shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5 flex flex-col">
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black font-['Manrope'] text-[#e5e2e1]">
              Select {type === "open" ? "Open" : "Close"} Time
            </h2>
            <p className="text-sm text-[#d0c5af]">
              Adjust {day} operational hours
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* BODY (FIXED SPACING + NO OVERFLOW COLLAPSE) */}
        <div className="p-6 flex flex-col items-center gap-6 flex-1 overflow-y-auto">
          {/* TIME CONTROL */}
          <div className="flex items-center gap-4">
            {/* Hour */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => setHour((p) => (p === 12 ? 1 : p + 1))}>
                <span className="material-symbols-outlined text-[#d0c5af]">
                  expand_less
                </span>
              </button>

              <span className="text-6xl font-black text-[#f2ca50] w-20 text-center">
                {hour.toString().padStart(2, "0")}
              </span>

              <button onClick={() => setHour((p) => (p === 1 ? 12 : p - 1))}>
                <span className="material-symbols-outlined text-[#d0c5af]">
                  expand_more
                </span>
              </button>
            </div>

            <span className="text-5xl text-[#e5e2e1] font-bold">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => setMinute((p) => (p + 5) % 60)}>
                <span className="material-symbols-outlined text-[#d0c5af]">
                  expand_less
                </span>
              </button>

              <span className="text-5xl font-bold text-[#e5e2e1] w-20 text-center">
                {minute.toString().padStart(2, "0")}
              </span>

              <button onClick={() => setMinute((p) => (p - 5 + 60) % 60)}>
                <span className="material-symbols-outlined text-[#d0c5af]">
                  expand_more
                </span>
              </button>
            </div>

            {/* AM / PM */}
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => setPeriod("AM")}
                className={`px-4 py-2 rounded-lg font-bold ${
                  period === "AM"
                    ? "bg-[#f2ca50] text-[#3c2f00]"
                    : "bg-[#2a2a2a] text-[#d0c5af]"
                }`}
              >
                AM
              </button>

              <button
                onClick={() => setPeriod("PM")}
                className={`px-4 py-2 rounded-lg font-bold ${
                  period === "PM"
                    ? "bg-[#f2ca50] text-[#3c2f00]"
                    : "bg-[#2a2a2a] text-[#d0c5af]"
                }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* CLOCK VISUAL (NO SE DEFORMA) */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border-4 border-[#2a2a2a] flex items-center justify-center shrink-0">
            <div className="absolute top-2 text-xs text-[#d0c5af]">12</div>
            <div className="absolute right-2 text-xs text-[#d0c5af]">3</div>
            <div className="absolute bottom-2 text-xs text-[#d0c5af]">6</div>
            <div className="absolute left-2 text-xs text-[#d0c5af]">9</div>

            <div
              className="absolute w-1 h-12 bg-[#f2ca50] origin-bottom bottom-1/2"
              style={{
                transform: `rotate(${hour * 30 + (minute / 60) * 30}deg)`,
              }}
            />

            <div
              className="absolute w-0.5 h-16 bg-[#e5e2e1] origin-bottom bottom-1/2"
              style={{
                transform: `rotate(${minute * 6}deg)`,
              }}
            />

            <div className="w-3 h-3 bg-[#f2ca50] rounded-full z-10" />
          </div>

          {/* QUICK MINUTES */}
          <div className="flex gap-3 w-full justify-center">
            {quickMinutes.map((m) => (
              <button
                key={m}
                onClick={() => setMinute(m)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                  minute === m
                    ? "bg-[#f2ca50]/10 text-[#f2ca50]"
                    : "bg-[#2a2a2a] text-[#d0c5af]"
                }`}
              >
                :{m.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 bg-[#131313] flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-[#353534] text-[#e5e2e1] font-bold"
          >
            Cancel
          </button>

          <button
            onClick={handleSetTime}
            className="flex-1 py-3 rounded-full bg-[#f2ca50] text-[#3c2f00] font-bold"
          >
            Set Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimePickerModal;

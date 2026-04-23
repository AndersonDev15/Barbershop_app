import type { Break } from "../../types/barbero.types";

interface BarberoBreakItemProps {
  breakItem: Break;
  onDelete: (id: string) => void;
}

export default function BarberoBreakItem({
  breakItem,
  onDelete,
}: BarberoBreakItemProps) {
  const { id, dayNumber, month, dayLabel, startTime, endTime, label, isToday } =
    breakItem;

  return (
    <div
      className={`group relative flex flex-col md:flex-row md:items-center bg-surface-container-low p-4 md:p-5 rounded-lg transition-all hover:bg-surface-container gap-4 md:gap-0 border-l-4 ${
        isToday ? "border-tertiary" : "border-outline-variant/30"
      }`}
    >
      {/* Bloque fecha (izquierda) */}
      <div
        className={`flex flex-row md:flex-col items-center md:justify-center bg-surface-container-highest w-full md:w-14 md:h-14 rounded-lg md:mr-8 p-3 md:p-0 gap-3 md:gap-0 ${
          isToday ? "opacity-100" : "opacity-60"
        }`}
      >
        <span
          className={`text-lg font-bold font-headline ${
            isToday ? "text-tertiary" : "text-on-surface"
          }`}
        >
          {dayNumber}
        </span>
        <span className="text-[10px] uppercase font-bold text-on-surface-variant">
          {month}
        </span>
      </div>

      {/* Grid de info */}
      <div className="grid grid-cols-1 md:grid-cols-3 flex-1 items-center gap-3 md:gap-6">
        {/* Col 1 — Date */}
        <div>
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">
            Date
          </p>
          <p className="text-sm font-headline font-bold text-on-surface">
            {dayLabel}
          </p>
          <p className="text-xs text-on-surface-variant/70 italic mt-0.5">
            {label}
          </p>
        </div>

        {/* Col 2 — Start → End */}
        <div className="flex items-center gap-4 md:gap-8">
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">
              Start
            </p>
            <p
              className={`text-base md:text-lg font-headline font-extrabold ${
                isToday ? "text-primary" : "text-on-surface"
              }`}
            >
              {startTime}
            </p>
          </div>
          <span className="material-symbols-outlined text-outline-variant mt-4">
            arrow_forward
          </span>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">
              End
            </p>
            <p
              className={`text-base md:text-lg font-headline font-extrabold ${
                isToday ? "text-primary" : "text-on-surface"
              }`}
            >
              {endTime}
            </p>
          </div>
        </div>

        {/* Col 3 — Badge */}
        <div className="flex md:justify-end">
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              isToday
                ? "bg-surface-bright text-tertiary"
                : "bg-surface-container-highest text-on-surface-variant"
            }`}
          >
            {isToday ? "Today" : "Scheduled"}
          </span>
        </div>
      </div>

      {/* Botón delete */}
      <button
        onClick={() => onDelete(id)}
        className="md:ml-8 p-2 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all self-end md:self-auto"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
}

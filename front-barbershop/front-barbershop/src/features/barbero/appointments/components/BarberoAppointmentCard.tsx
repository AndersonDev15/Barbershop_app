import type { Appointment } from "../../types/barbero.types";

interface BarberoAppointmentCardProps {
  appointment: Appointment;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDetails: (id: string) => void;
}

export default function BarberoAppointmentCard({
  appointment,
  onStart,
  onComplete,
  onDetails,
}: BarberoAppointmentCardProps) {
  const { id, startTime, endTime, clientName, status } = appointment;

  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";
  const isConfirmed = status === "confirmed";

  return (
    <div
      className={`group relative p-5 rounded-lg transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isInProgress
          ? "bg-surface-container-high hover:bg-surface-bright"
          : isConfirmed
            ? "bg-surface-container hover:translate-x-2"
            : "bg-surface-container-lowest opacity-70"
      }`}
    >
      {/* Columna izquierda */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Hora */}
        <div className="flex flex-col min-w-0 md:min-w-[80px]">
          <span
            className={`text-xl font-black leading-none ${
              isCompleted ? "text-on-surface-variant" : "text-on-surface"
            }`}
          >
            {startTime}
          </span>
          <span className="text-xs font-medium text-on-surface-variant tracking-widest uppercase mt-1">
            {endTime}
          </span>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>

        {/* Info cliente */}
        <div>
          <h3
            className={`text-base font-bold transition-colors duration-300 ${
              isCompleted
                ? "text-on-surface-variant line-through"
                : "text-on-surface group-hover:text-primary"
            }`}
          >
            {clientName}
          </h3>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status badge */}
        {isInProgress && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary/10 border border-tertiary/20 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-tertiary text-xs font-bold uppercase tracking-widest">
              In Progress
            </span>
          </div>
        )}
        {isConfirmed && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/50 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-on-surface-variant"></span>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
              Confirmed
            </span>
          </div>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 whitespace-nowrap">
            <span
              className="material-symbols-outlined text-primary text-xs"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              Completed
            </span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-1 md:flex-none items-center gap-2">
          <button
            onClick={() => onDetails(id)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-outline-variant/30 hover:bg-surface-variant text-on-surface text-xs font-bold uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">
              visibility
            </span>
            Details
          </button>

          {isConfirmed && (
            <button
              onClick={() => onStart(id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-tertiary text-on-tertiary text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-tertiary/10 hover:brightness-110 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">
                play_arrow
              </span>
              Start
            </button>
          )}

          {isInProgress && (
            <button
              onClick={() => onComplete(id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/10 hover:brightness-110 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

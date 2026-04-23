import type { Appointment } from "../../types/barbero.types";
import BarberoAppointmentCard from "./BarberoAppointmentCard";

interface BarberoAppointmentsListProps {
  appointments: Appointment[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDetails: (id: string) => void;
}

export default function BarberoAppointmentsList({
  appointments,
  onStart,
  onComplete,
  onDetails,
}: BarberoAppointmentsListProps) {
  return (
    <div className="space-y-3 pb-8">
      {appointments.map((appointment) => (
        <BarberoAppointmentCard
          key={appointment.id}
          appointment={appointment}
          onStart={onStart}
          onComplete={onComplete}
          onDetails={onDetails}
        />
      ))}

      {appointments.length === 0 && (
        <div className="bg-surface-container/30 border border-dashed border-outline-variant/20 rounded-xl p-20 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4">
            event_busy
          </span>
          <p className="text-on-surface-variant font-medium uppercase tracking-widest text-xs">
            No appointments scheduled for this date.
          </p>
        </div>
      )}
    </div>
  );
}

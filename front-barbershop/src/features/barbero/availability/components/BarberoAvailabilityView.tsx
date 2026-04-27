import BarberoAvailabilityHourGroup from "./BarberoAvailabilityHourGroup";
import type { BarberAvailabilityResponse } from "../../../../hooks/useBarberAvailability";

interface BarberoAvailabilityViewProps {
  data: BarberAvailabilityResponse | null;
  loading: boolean;
  error: string | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function BarberoAvailabilityView({
  data,
  loading,
  error,
  selectedDate,
  onDateChange,
}: BarberoAvailabilityViewProps) {
  // Helper para agrupar slots por hora
  const groupSlotsByHour = (slots: any[]) => {
    const groups: { [key: string]: any[] } = {};

    slots.forEach((slot) => {
      const hour = slot.time.split(":")[0];
      const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
      const displayHour = `${hour}:00 ${ampm}`;

      if (!groups[displayHour]) {
        groups[displayHour] = [];
      }

      // Mapear status del backend a los esperados por el componente visual
      let mappedStatus: "available" | "occupied" | "not-available" =
        "available";
      if (slot.status === "OCUPADO") mappedStatus = "occupied";
      if (slot.status === "NO DISPONIBLE") mappedStatus = "not-available";

      // Formatear tiempo de HH:mm:ss a HH:mm para la visualización de los slots
      const formattedTime = slot.time.substring(0, 5);

      groups[displayHour].push({
        ...slot,
        time: formattedTime,
        status: mappedStatus,
      });
    });

    return Object.keys(groups).map((hour) => ({
      hour,
      slots: groups[hour],
    }));
  };

  const availabilityData = data ? groupSlotsByHour(data.allSlots) : [];

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-on-surface-variant animate-pulse font-medium">
          Cargando disponibilidad...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-error-container/10 rounded-2xl border border-error/20">
        <span className="material-symbols-outlined text-error text-5xl mb-4">
          error
        </span>
        <h3 className="text-on-surface font-headline text-xl font-bold mb-2">
          ¡Ups! Algo salió mal
        </h3>
        <p className="text-on-surface-variant mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:bg-primary-container transition-all"
        >
          REINTENTAR
        </button>
      </div>
    );
  }

  const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    },
  );

  const availableSlotsCount = data?.allSlots.filter(
    (s) => s.status === "DISPONIBLE",
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
      {/* Header Info */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-16">
        <div>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">
            Welcome, {data?.barberName.split(" ")[0] || "Barber"}.
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-surface-container-high text-primary font-headline text-base md:text-lg font-bold tracking-tight px-3 py-1 rounded-lg border-none focus:ring-2 focus:ring-primary/50 outline-none"
            />
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
            <span className="text-on-surface-variant font-medium text-xs md:text-base">
              {availableSlotsCount} Slots Remaining
            </span>
          </div>
        </div>
      </header>

      {/* Hour Groups */}
      <div
        className={`space-y-8 md:space-y-12 transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
      >
        {availabilityData.map((group) => (
          <BarberoAvailabilityHourGroup
            key={group.hour}
            hour={group.hour}
            slots={group.slots}
          />
        ))}

        {availabilityData.length === 0 && !loading && (
          <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-outline-variant/10">
            <span className="material-symbols-outlined text-on-surface-variant/20 text-6xl mb-4">
              calendar_today
            </span>
            <p className="text-on-surface-variant font-medium">
              No hay turnos configurados para esta fecha.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

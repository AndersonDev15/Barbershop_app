import type { ReservationResponse } from "../../types/barbero.types";

interface BarberoAppointmentDetailPanelProps {
  reservation: ReservationResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

export default function BarberoAppointmentDetailPanel({
  reservation,
  isOpen,
  onClose,
  onStart,
  onComplete,
}: BarberoAppointmentDetailPanelProps) {
  if (!isOpen || !reservation) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "EN_CURSO":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-tertiary/10 text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-tertiary" />
            In Progress
          </span>
        );
      case "COMPLETADA":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-primary/10 text-primary">
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-primary" />
            Completed
          </span>
        );
      case "CONFIRMADA":
      case "PENDIENTE":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-secondary-container/50 text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-on-surface-variant" />
            Confirmed
          </span>
        );
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-surface-dim z-[95] shadow-2xl flex flex-col border-l border-outline-variant/10 animate-in slide-in-from-right duration-500">
        {/* Header */}
        <header className="px-8 pt-10 pb-6 flex justify-between items-start sticky top-0 bg-surface-dim z-10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-1">
              Appointment Details
            </p>
            <h2 className="text-xl font-extrabold font-headline tracking-tight text-on-surface">
              {reservation.client}
            </h2>
            <div className="mt-3">{getStatusBadge(reservation.status)}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto px-8 pb-32 space-y-8 no-scrollbar">
          {/* Client Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">
                person
              </span>
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                General Information
              </label>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-primary">
                  {getInitials(reservation.client)}
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Client
                  </p>
                  <p className="text-sm font-bold text-on-surface font-headline">
                    {reservation.client}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-tertiary">
                  <span className="material-symbols-outlined text-base">content_cut</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Barber
                  </p>
                  <p className="text-sm font-bold text-on-surface font-headline">
                    {reservation.barber}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Selected Services */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">
                list_alt
              </span>
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Selected Services
              </h3>
            </div>
            <div className="space-y-2">
              {reservation.services.map((service) => (
                <div key={service.id} className="bg-surface-container p-4 rounded-lg flex justify-between items-center hover:bg-surface-container-high transition-colors">
                  <div className="space-y-1">
                    <p className="font-bold text-on-surface text-sm font-headline">
                      {service.name}
                    </p>
                    <div className="flex items-center text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px] mr-1">
                        schedule
                      </span>
                      {service.duration} min
                    </div>
                  </div>
                  <p className="text-base font-bold text-primary font-headline">
                    {formatCurrency(service.price)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Schedule & Duration */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">
                calendar_today
              </span>
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Schedule & Duration
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-surface-container-low p-4 rounded-lg">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="text-sm font-bold font-headline text-on-surface">
                  {reservation.date}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Start Time
                  </p>
                  <p className="text-sm font-bold font-headline text-on-surface">
                    {reservation.startTime}
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    End Time
                  </p>
                  <p className="text-sm font-bold font-headline text-on-surface">
                    {reservation.endTime}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Financial Summary */}
          <section className="pt-6 border-t border-outline-variant/20">
            <div className="bg-surface-container-highest p-5 rounded-lg flex justify-between items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">
                  Total Amount
                </p>
                <p className="text-on-surface-variant text-xs">
                  Estimated based on services
                </p>
              </div>
              <p className="text-2xl font-black text-primary font-headline">
                {formatCurrency(reservation.totalPrice)}
              </p>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <footer className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-surface-dim via-surface-dim to-transparent pt-12">
          <div className="flex gap-3">
            {reservation.status === "CONFIRMADA" && (
              <button
                onClick={() => onStart(reservation.id.toString())}
                className="flex-1 bg-tertiary text-on-tertiary py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-tertiary/10 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                Start Appointment
              </button>
            )}
            {reservation.status === "EN_CURSO" && (
              <button
                onClick={() => onComplete(reservation.id.toString())}
                className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                Complete Appointment
              </button>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}

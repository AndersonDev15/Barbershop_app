import type { ReservationResponse } from "../../types/cliente.types";

interface ClienteReservationDetailPanelProps {
  isOpen: boolean;
  reservation: ReservationResponse | null;
  onClose: () => void;
  onCancel: (reservationId: number) => void;
}

export default function ClienteReservationDetailPanel({
  isOpen,
  reservation,
  onClose,
  onCancel,
}: ClienteReservationDetailPanelProps) {
  if (!isOpen || !reservation) return null;

  const {
    id,
    barber,
    client,
    date,
    startTime,
    endTime,
    services,
    totalPrice,
    status,
  } = reservation;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + "T00:00");
      const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];

      const dayName = days[date.getDay()];
      const dayNum = date.getDate();
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();

      return `${dayName}, ${dayNum} ${monthName} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace(/\s/g, "");
  };

  const totalDuration = services.reduce((acc, s) => acc + s.duration, 0);
  const canCancel = status === "PENDIENTE" || status === "CONFIRMADA";

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "CONFIRMADA":
        return "text-tertiary bg-tertiary/10 border-tertiary/20";
      case "EN_CURSO":
        return "text-primary bg-primary/10 border-primary/20";
      case "COMPLETADA":
        return "text-on-surface-variant bg-on-surface-variant/10 border-on-surface-variant/20";
      case "CANCELADA":
        return "text-error bg-error/10 border-error/20";
      default:
        return "text-on-surface-variant bg-surface-container border-outline-variant/10";
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 h-screen w-full md:w-[480px] bg-surface-container-lowest z-[95] flex flex-col shadow-[0px_24px_48px_rgba(0,0,0,0.5)] border-l border-outline-variant/10 animate-in slide-in-from-right duration-300">
        <div className="flex-shrink-0">
          <header className="p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest hover:bg-surface-bright text-on-surface transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${getStatusStyles(status)}`}
              >
                {status}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                Reservation Details
              </span>
              <h3 className="text-3xl font-headline font-black tracking-tight text-on-surface uppercase italic">
                #{id}
              </h3>
            </div>
          </header>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar">
          <div className="h-px w-full bg-outline-variant/10" />

          {/* Info Participantes */}
          <section className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5">
              <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block mb-2">
                Barber
              </span>
              <p className="text-sm font-bold text-on-surface">{barber}</p>
            </div>
            <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5">
              <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest block mb-2">
                Client
              </span>
              <p className="text-sm font-bold text-on-surface">{client}</p>
            </div>
          </section>

          {/* Horario */}
          <section className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">event</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-on-surface">
                  {formatDate(date)}
                </span>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  {startTime} — {endTime}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block">
                Duration
              </span>
              <span className="text-xs font-bold text-on-surface">
                {totalDuration} min
              </span>
            </div>
          </section>

          {/* Servicios */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">
                content_cut
              </span>
              <h4 className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold font-label">
                Services Rendered
              </h4>
            </div>

            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/10"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-on-surface">
                      {service.name}
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                      {service.duration} min
                    </span>
                  </div>
                  <span className="text-sm font-black text-primary">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-outline-variant/10 my-4" />

            <div className="flex justify-between items-center px-3">
              <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">
                Total Amount
              </span>
              <span className="text-2xl font-black text-primary">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </section>
        </div>

        {/* Acciones */}
        <div className="p-6 mt-auto border-t border-outline-variant/10 bg-surface-container-low flex flex-col gap-3">
          {canCancel && (
            <button
              onClick={() => onCancel(id)}
              className="w-full py-4 bg-error/10 text-error font-black uppercase tracking-[0.2em] rounded-xl border border-error/20 hover:bg-error/20 transition-all active:scale-[0.98]"
            >
              Cancelar Reserva
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-4 bg-on-surface text-surface font-black uppercase tracking-[0.2em] rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Close Detail
          </button>
        </div>
      </aside>
    </>
  );
}

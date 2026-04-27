import type { ReservationResponse } from "../../types/cliente.types";

interface ClienteReservationCardProps {
  reservation: ReservationResponse;
  onDetail: (reservation: ReservationResponse) => void;
  onCancel: (reservationId: number) => void;
  onPay: (reservation: ReservationResponse) => void;
}

export default function ClienteReservationCard({
  reservation,
  onDetail,
  onCancel,
  onPay,
}: ClienteReservationCardProps) {
  const { id, barber, date, startTime, endTime, totalPrice, status } =
    reservation;

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

  const canCancel = status === "PENDIENTE" || status === "CONFIRMADA";

  const canPay = status !== "CANCELADA" && status !== "COMPLETADA";
  return (
    <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5 hover:border-primary/20 transition-all group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Info Principal */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">person</span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface">
              {barber}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                {formatDate(date)}
              </span>
              <div className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {startTime} — {endTime}
              </span>
            </div>
          </div>
        </div>

        {/* Status y Precio */}
        <div className="flex items-center justify-between md:justify-end gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5">
              Total
            </p>
            <p className="text-lg font-black text-primary leading-none">
              {formatCurrency(totalPrice)}
            </p>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(status)}`}
          >
            {status}
          </div>
        </div>
      </div>

      <div className="h-px bg-outline-variant/10 my-4" />

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        {canPay && (
          <button
            onClick={() => onPay(reservation)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all active:scale-95"
          >
            Pagar
          </button>
        )}
        {canCancel && (
          <button
            onClick={() => onCancel(id)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-error/30 text-error text-[10px] font-black uppercase tracking-widest hover:bg-error/5 transition-all active:scale-95"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={() => onDetail(reservation)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Ver detalles
          <span className="material-symbols-outlined text-xs">visibility</span>
        </button>
      </div>
    </div>
  );
}

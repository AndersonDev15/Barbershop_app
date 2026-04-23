import { useState, useEffect } from "react";
import ClienteSidebar from "../../common/components/ClienteSidebar";
import ClienteTopBar from "../../common/components/ClienteTopBar";
import api from "../../../../lib/api";
import type {
  ReservationResponse,
  ReservationStatus,
} from "../../types/cliente.types";
import ClienteReservationCard from "../components/ClienteReservationCard";
import ClienteReservationDetailPanel from "../components/ClienteReservationDetailPanel";
import ClientePaymentModal from "../components/ClientePaymentModal";

export default function ClienteReservationsPage() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ReservationStatus | "TODAS">(
    "TODAS",
  );
  const [detailPanel, setDetailPanel] = useState<{
    isOpen: boolean;
    reservation: ReservationResponse | null;
  }>({ isOpen: false, reservation: null });

  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    reservation: ReservationResponse | null;
  }>({ isOpen: false, reservation: null });

  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/client/reservations");
      setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("No pudimos cargar tus reservas. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId: number) => {
    try {
      const { data } = await api.patch(
        `/api/client/reservations/${reservationId}/cancel`,
      );
      // Actualizar la reserva en el array local sin refetch
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? data : r)),
      );

      // Si el panel de detalle está abierto con esta reserva, actualizarlo también
      if (detailPanel.isOpen && detailPanel.reservation?.id === reservationId) {
        setDetailPanel((prev) => ({ ...prev, reservation: data }));
      }
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      // Mostrar error sin crashear
    }
  };

  const filtered =
    activeFilter === "TODAS"
      ? reservations
      : reservations.filter((r) => r.status === activeFilter);

  const filterOptions: (ReservationStatus | "TODAS")[] = [
    "TODAS",
    "PENDIENTE",
    "CONFIRMADA",
    "EN_CURSO",
    "COMPLETADA",
    "CANCELADA",
  ];

  const getCount = (status: ReservationStatus | "TODAS") => {
    if (status === "TODAS") return reservations.length;
    return reservations.filter((r) => r.status === status).length;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <ClienteSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <ClienteTopBar />
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 lg:p-10 custom-scrollbar">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1">
              Mis Reservas
            </p>
            <h1 className="text-4xl font-headline font-black tracking-tight text-on-surface italic uppercase">
              Gestionar Citas
            </h1>
          </div>

          {/* Tabs de Filtro */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {filterOptions.map((option) => {
              const isActive = activeFilter === option;
              const count = getCount(option);

              return (
                <button
                  key={option}
                  onClick={() => setActiveFilter(option)}
                  className={`
                    whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                    ${
                      isActive
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                    }
                  `}
                >
                  {option} <span className="opacity-50 ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                Cargando reservas...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-3xl border border-outline-variant/5">
              <span className="material-symbols-outlined text-error text-5xl mb-4">
                error
              </span>
              <p className="text-on-surface font-bold mb-4">{error}</p>
              <button
                onClick={fetchReservations}
                className="px-8 py-3 bg-primary text-on-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-3xl border border-outline-variant/5">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl">
                  calendar_today
                </span>
              </div>
              <h3 className="text-lg font-headline font-black text-on-surface uppercase tracking-tight mb-2">
                No hay reservas
              </h3>
              <p className="text-on-surface-variant text-sm max-w-xs text-center">
                {activeFilter === "TODAS"
                  ? "Aún no has realizado ninguna reserva. ¡Agenda tu primera cita hoy!"
                  : `No tienes reservas con estado "${activeFilter}" en este momento.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filtered.map((reservation) => (
                <ClienteReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onDetail={(r) =>
                    setDetailPanel({ isOpen: true, reservation: r })
                  }
                  onCancel={handleCancel}
                  onPay={(r) =>
                    setPaymentModal({ isOpen: true, reservation: r })
                  }
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <ClienteReservationDetailPanel
        isOpen={detailPanel.isOpen}
        reservation={detailPanel.reservation}
        onClose={() => setDetailPanel({ isOpen: false, reservation: null })}
        onCancel={handleCancel}
      />
      ;
      <ClientePaymentModal
        isOpen={paymentModal.isOpen}
        reservation={paymentModal.reservation}
        onClose={() => setPaymentModal({ isOpen: false, reservation: null })}
        onSuccess={() => setPaymentModal({ isOpen: false, reservation: null })}
      />
      ;
    </div>
  );
}

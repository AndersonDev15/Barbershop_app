import { useState, useEffect, useCallback } from "react";
import BarberoSidebar from "../../common/components/BarberoSidebar";
import BarberoTopBar from "../../common/components/BarberoTopBar";
import BarberoAppointmentsHeader from "../components/BarberoAppointmentsHeader";
import BarberoAppointmentsList from "../components/BarberoAppointmentsList";
import BarberoAppointmentCard from "../components/BarberoAppointmentCard";
import BarberoAppointmentDetailPanel from "../components/BarberoAppointmentDetailPanel";
import type {
  Appointment,
  ReservationResponse,
} from "../../types/barbero.types";
import api from "../../../../lib/api";

export default function BarberoTodayAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const [detailPanel, setDetailPanel] = useState<{
    isOpen: boolean;
    reservation: ReservationResponse | null;
  }>({ isOpen: false, reservation: null });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);

  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  const fetchAppointments = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const endpoint =
        date === today
          ? "/api/barber/reservation/today"
          : `/api/barber/reservation/daily?date=${date}`;

      const response = await api.get(endpoint);
      const data = response.data;

      setReservations(data);

      const statusMap: Record<string, Appointment["status"]> = {
        PENDIENTE: "confirmed",
        CONFIRMADA: "confirmed",
        EN_CURSO: "in_progress",
        COMPLETADA: "completed",
        CANCELADA: "completed",
      };

      const mapped: Appointment[] = data.map((item: ReservationResponse) => ({
        id: item.id.toString(),
        startTime: item.startTime,
        endTime: item.endTime,
        clientName: item.client,
        service: item.services.map((s) => s.name).join(", "),
        status: statusMap[item.status] || "confirmed",
      }));

      setAppointments(mapped);

      const totalRevenue = data.reduce(
        (sum: number, item: any) => sum + (item.totalPrice || 0),
        0,
      );
      setRevenue(totalRevenue);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      showToast("Error loading appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate, fetchAppointments]);

  function showToast(message: string) {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  }

  async function handleStart(id: string) {
    try {
      await api.patch(`/api/barber/reservation/${id}/status`, {
        status: "EN_CURSO",
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "in_progress" } : a)),
      );
      showToast("Appointment started");
    } catch (error) {
      console.error("Error starting appointment:", error);
      showToast("Error starting appointment");
    }
  }

  async function handleComplete(id: string) {
    try {
      await api.patch(`/api/barber/reservation/${id}/status`, {
        status: "COMPLETADA",
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a)),
      );
      showToast("Appointment completed");
    } catch (error) {
      console.error("Error completing appointment:", error);
      showToast("Error completing appointment");
    }
  }

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <BarberoSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <BarberoTopBar />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-surface-dim w-full min-w-0 p-4 md:p-6 lg:p-8">
          <BarberoAppointmentsHeader
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            totalBookings={appointments.length}
            estimatedRevenue={formatCurrency(revenue)}
          />
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <BarberoAppointmentsList
              appointments={sortedAppointments}
              onStart={handleStart}
              onComplete={handleComplete}
              onDetails={(id) => {
                const reservation =
                  reservations.find((r) => r.id.toString() === id) || null;
                setDetailPanel({ isOpen: true, reservation });
              }}
            />
          )}
        </main>
      </div>

      <BarberoAppointmentDetailPanel
        isOpen={detailPanel.isOpen}
        reservation={detailPanel.reservation}
        onClose={() => setDetailPanel({ isOpen: false, reservation: null })}
        onStart={handleStart}
        onComplete={handleComplete}
      />

      {/* Toast */}
      {toast.visible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-on-primary px-8 py-4 rounded-xl font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <span className="text-sm uppercase tracking-widest">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}

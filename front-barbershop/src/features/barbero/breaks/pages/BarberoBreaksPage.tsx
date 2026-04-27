import { useState, useEffect, useCallback } from "react";
import BarberoSidebar from "../../common/components/BarberoSidebar";
import BarberoTopBar from "../../common/components/BarberoTopBar";
import BarberoBreaksHeader from "../components/BarberoBreaksHeader";
import BarberoBreaksList from "../components/BarberoBreaksList";
import BarberoCreateBreakModal from "../components/BarberoCreateBreakModal";
import type { Break } from "../../types/barbero.types";
import api from "../../../../lib/api";

export default function BarberoBreaksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (time: string) => {
    // Si viene como HH:mm:ss, tomamos solo HH:mm
    const cleanTime = time.length > 5 ? time.substring(0, 5) : time;
    return new Date(`1970-01-01T${cleanTime}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const to24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "AM") {
      if (hours === "12") hours = "00";
    } else {
      if (hours !== "12") hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const mapBreak = (item: any): Break => {
    const breakDate = new Date(item.date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      id: item.id.toString(),
      date: item.date,
      dayLabel: breakDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      dayNumber: breakDate.getDate().toString(),
      month: breakDate.toLocaleDateString("en-US", { month: "short" }),
      startTime: formatTime(item.start),
      endTime: formatTime(item.end),
      label: "Break",
      isToday: item.date === today.toISOString().split("T")[0],
    };
  };

  const fetchBreaks = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/barber/break?date=${date}`);
      const mapped = res.data.map(mapBreak);
      setBreaks(mapped);
    } catch (err) {
      console.error("Error fetching breaks", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBreaks(selectedDate);
  }, [selectedDate, fetchBreaks]);

  function handleDelete(id: string) {
    // Como no hay endpoint, solo eliminamos del estado
    setBreaks((prev) => prev.filter((b) => b.id !== id));
  }

  async function handleSaveBreak(data: {
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
  }) {
    const dateToUse = data.date || selectedDate;
    try {
      await api.post("/api/barber/break", {
        date: dateToUse,
        start: to24Hour(data.startTime),
        end: to24Hour(data.endTime),
      });
      await fetchBreaks(selectedDate);
      setIsCreateOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "No se pudo crear el descanso");
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <BarberoSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <BarberoTopBar />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 sm:p-6 md:p-8 lg:p-10 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            <BarberoBreaksHeader onCreateBreak={() => setIsCreateOpen(true)} />

            {/* Selector de fecha */}
            <div className="flex items-center gap-4 mb-8 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary">
                calendar_today
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-on-surface font-headline font-bold outline-none cursor-pointer"
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-on-surface-variant animate-pulse font-medium">
                  Cargando descansos...
                </p>
              </div>
            ) : (
              <BarberoBreaksList breaks={breaks} onDelete={handleDelete} />
            )}
          </div>
        </main>
      </div>

      <BarberoCreateBreakModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveBreak}
      />
    </div>
  );
}

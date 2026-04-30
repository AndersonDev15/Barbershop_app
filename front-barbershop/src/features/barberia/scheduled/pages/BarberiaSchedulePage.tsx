import { useState, useEffect } from "react";
import Sidebar from "../../common/components/Sidebar";
import Topbar from "../../common/components/Topbar";
import TimePickerModal from "../components/TimePickerModal";
import api from "../../../../lib/api";
import type {
  DaySchedule,
  DayOfWeek,
  OpeningHoursResponse,
} from "../../types/schedule.types";

const DAY_CONFIG: {
  dayOfWeek: DayOfWeek;
  label: string;
  defaultOpen: string;
  defaultClose: string;
}[] = [
  {
    dayOfWeek: "MONDAY",
    label: "Monday",
    defaultOpen: "09:00",
    defaultClose: "20:00",
  },
  {
    dayOfWeek: "TUESDAY",
    label: "Tuesday",
    defaultOpen: "09:00",
    defaultClose: "20:00",
  },
  {
    dayOfWeek: "WEDNESDAY",
    label: "Wednesday",
    defaultOpen: "09:00",
    defaultClose: "20:00",
  },
  {
    dayOfWeek: "THURSDAY",
    label: "Thursday",
    defaultOpen: "09:00",
    defaultClose: "20:00",
  },
  {
    dayOfWeek: "FRIDAY",
    label: "Friday",
    defaultOpen: "09:00",
    defaultClose: "22:00",
  },
  {
    dayOfWeek: "SATURDAY",
    label: "Saturday",
    defaultOpen: "10:00",
    defaultClose: "18:00",
  },
  {
    dayOfWeek: "SUNDAY",
    label: "Sunday",
    defaultOpen: "10:00",
    defaultClose: "18:00",
  },
];

interface Holiday {
  id: number;
  label: string;
  date: string;
}

export default function BarberiaSchedulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [schedules, setSchedules] = useState<DaySchedule[]>(() =>
    DAY_CONFIG.map((d, idx) => ({
      id: 0,
      day: d.label,
      dayOfWeek: d.dayOfWeek,
      open: false,
      openTime: d.defaultOpen,
      closeTime: d.defaultClose,
      status: "closed" as const,
    })),
  );
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [timeModal, setTimeModal] = useState<{
    isOpen: boolean;
    type: "open" | "close";
    day: string;
    time: string;
  }>({
    isOpen: false,
    type: "open",
    day: "",
    time: "",
  });

  const selectedDay = schedules[selectedDayIndex];

  useEffect(() => {
    fetchOpeningHours();
  }, []);

  const fetchOpeningHours = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<OpeningHoursResponse[]>(
        "/api/barbershop/opening-hours",
      );
      const fetchedHours = response.data;

      setSchedules((prev) =>
        DAY_CONFIG.map((config) => {
          const existing = fetchedHours.find(
            (h) => h.dayOfWeek === config.dayOfWeek,
          );
          if (existing) {
            const openTime = existing.startTime.substring(0, 5);
            const closeTime = existing.endTime.substring(0, 5);
            const status = closeTime >= "21:00" ? "late_night" : "open";
            return {
              id: existing.id,
              day: config.label,
              dayOfWeek: config.dayOfWeek,
              open: true,
              openTime,
              closeTime,
              status,
            };
          }
          return {
            id: 0,
            day: config.label,
            dayOfWeek: config.dayOfWeek,
            open: false,
            openTime: config.defaultOpen,
            closeTime: config.defaultClose,
            status: "closed" as const,
          };
        }),
      );
    } catch (err: any) {
      console.error("Error fetching opening hours:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load opening hours. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const promises: Promise<any>[] = [];

      for (const schedule of schedules) {
        if (schedule.open) {
          if (schedule.id === 0) {
            promises.push(
              api
                .post("/api/barbershop/opening-hours", {
                  dayOfWeek: schedule.dayOfWeek,
                  startTime: schedule.openTime,
                  endTime: schedule.closeTime,
                })
                .then((res) => {
                  setSchedules((prev) =>
                    prev.map((s) =>
                      s.dayOfWeek === schedule.dayOfWeek
                        ? { ...s, id: res.data.id }
                        : s,
                    ),
                  );
                }),
            );
          } else {
            promises.push(
              api.put(`/api/barbershop/opening-hours/${schedule.id}`, {
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.openTime,
                endTime: schedule.closeTime,
              }),
            );
          }
        } else if (schedule.id > 0) {
          promises.push(
            api
              .delete(`/api/barbershop/opening-hours/${schedule.id}`)
              .then(() => {
                setSchedules((prev) =>
                  prev.map((s) =>
                    s.dayOfWeek === schedule.dayOfWeek ? { ...s, id: 0 } : s,
                  ),
                );
              }),
          );
        }
      }

      await Promise.all(promises);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("Error saving opening hours:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (index: number) => {
    setSchedules((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        const newOpen = !s.open;
        return {
          ...s,
          open: newOpen,
          status: newOpen
            ? s.closeTime >= "21:00"
              ? "late_night"
              : "open"
            : "closed",
        };
      }),
    );
  };

  const updateTime = (
    index: number,
    field: "openTime" | "closeTime",
    value: string,
  ) => {
    setSchedules((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        const updated = { ...s, [field]: value };
        if (field === "closeTime") {
          updated.status = updated.closeTime >= "21:00" ? "late_night" : "open";
        }
        return updated;
      }),
    );
  };

  const addHoliday = () => {
    setHolidays((prev) => [
      ...prev,
      { id: Date.now(), label: "New Exception", date: "" },
    ]);
  };

  const updateHoliday = (
    id: number,
    field: "label" | "date",
    value: string,
  ) => {
    setHolidays((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
    );
  };

  const deleteHoliday = (id: number) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const formatTo12h = (time24: string) => {
    if (!time24) return "09:00 AM";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    return `${h12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const formatTo24h = (time12: string) => {
    const [timePart, period] = time12.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
          <Topbar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            pageTitle="Schedule"
          />
          <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">
                progress_activity
              </span>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">
                Loading schedule...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
          <Topbar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            pageTitle="Schedule"
          />
          <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <span className="material-symbols-outlined text-5xl text-error">
                error
              </span>
              <p className="text-error font-bold text-center max-w-md">
                {error}
              </p>
              <button
                onClick={fetchOpeningHours}
                className="mt-4 px-6 py-2 bg-surface-container rounded-full text-primary font-bold hover:bg-surface-container-high transition-colors"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface font-['Inter'] selection:bg-[#f2ca50]/30">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <Topbar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          pageTitle="Schedule"
        />

        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
              <div>
                <span className="text-[#f2ca50] font-bold uppercase tracking-[0.2em] text-[0.65rem] mb-2 block">
                  Store Operations
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-[#e5e2e1] font-['Manrope']">
                  Weekly Schedule
                </h2>
                <p className="text-[#99907c] font-medium mt-2 max-w-lg text-sm md:text-base">
                  Configure the global operating hours for the atelier. These
                  hours apply to all staff and services.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-[#d4af37] text-[#3c2f00] px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-70 disabled:pointer-events-none min-w-[140px] justify-center"
                >
                  {isSaving ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">
                        progress_activity
                      </span>
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-sm">
                        check
                      </span>
                      Saved!
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">
                        save
                      </span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="col-span-12 lg:col-span-4 space-y-6 md:space-y-8">
                {/* Operational Days */}
                <section className="bg-[#1c1b1b] p-4 md:p-8 rounded-2xl border border-[#4d4635]/10 shadow-2xl">
                  <h3 className="font-['Manrope'] text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#f2ca50]">
                      event_available
                    </span>
                    Operational Days
                  </h3>
                  <div className="space-y-3">
                    {schedules.map((day, index) => (
                      <div
                        key={day.dayOfWeek}
                        className={`flex items-center justify-between p-4 bg-[#131313] rounded-2xl border transition-all ${
                          day.open
                            ? "border-[#d4af37]/20 ring-1 ring-[#d4af37]/10"
                            : "border-transparent opacity-40 grayscale"
                        }`}
                      >
                        <span
                          className={`font-bold text-sm ${day.open ? "text-[#e5e2e1]" : "text-[#99907c]"}`}
                        >
                          {day.day}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={day.open}
                            onChange={() => toggleDay(index)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#353534] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                        </label>
                      </div>
                    ))}
                    <p className="text-[0.7rem] text-[#99907c] italic px-2 pt-2 border-t border-[#4d4635]/10 leading-relaxed">
                      Days toggled off will automatically block bookings for the
                      entire shop.
                    </p>
                  </div>
                </section>

                {/* Master Schedule tip */}
                <section className="bg-[#d4af37]/5 p-8 rounded-2xl border border-[#d4af37]/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="material-symbols-outlined text-[#d4af37] text-4xl mb-4 block">
                      lightbulb
                    </span>
                    <h3 className="font-['Manrope'] text-lg font-bold mb-2">
                      Master Schedule
                    </h3>
                    <p className="text-sm text-[#99907c] leading-relaxed">
                      Changes made here affect the shop's public availability.
                      Individual barber shifts are managed in the <b>Barbers</b>{" "}
                      section.
                    </p>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-[#d4af37]/5 select-none">
                    calendar_view_day
                  </span>
                </section>

                {/* Holiday Exceptions */}
                <section className="bg-[#1c1b1b] border border-[#4d4635]/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <h5 className="font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] text-[#f2ca50]">
                      <span className="material-symbols-outlined text-sm">
                        event_busy
                      </span>
                      Holiday Exceptions
                    </h5>
                    <button
                      onClick={addHoliday}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#f2ca50]/10 text-[#f2ca50] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#f2ca50]/20 hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-all"
                    >
                      <span className="material-symbols-outlined text-xs">
                        add
                      </span>
                      New Exception
                    </button>
                  </div>

                  <div className="space-y-3">
                    {holidays.map((h) => (
                      <div
                        key={h.id}
                        className="bg-[#131313] rounded-xl p-3 border border-[#4d4635]/10 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={h.label}
                            onChange={(e) =>
                              updateHoliday(h.id, "label", e.target.value)
                            }
                            className="flex-1 bg-[#1c1b1b] border border-[#4d4635]/20 rounded-lg px-3 py-1.5 text-sm text-[#e5e2e1] outline-none focus:ring-1 focus:ring-[#d4af37] min-w-0"
                          />
                          <button
                            onClick={() => deleteHoliday(h.id)}
                            className="shrink-0 p-1.5 text-[#99907c] hover:text-red-400 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">
                              delete_outline
                            </span>
                          </button>
                        </div>
                        <input
                          type="date"
                          value={h.date}
                          onChange={(e) =>
                            updateHoliday(h.id, "date", e.target.value)
                          }
                          className="w-full bg-[#1c1b1b] border border-[#4d4635]/20 rounded-lg px-3 py-1.5 text-sm text-[#99907c] outline-none focus:ring-1 focus:ring-[#d4af37]"
                        />
                      </div>
                    ))}
                    {holidays.length === 0 && (
                      <p className="text-xs text-[#99907c] italic">
                        No exceptions configured.
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-[#1c1b1b] rounded-2xl border border-[#4d4635]/10 shadow-2xl overflow-hidden">
                  {/* Day selector */}
                  <div className="grid grid-cols-7 gap-[1px] bg-[#4d4635]/10">
                    {schedules.map((day, index) => (
                      <div
                        key={day.dayOfWeek}
                        onClick={() => setSelectedDayIndex(index)}
                        className={`p-4 text-center cursor-pointer transition-colors ${
                          selectedDayIndex === index
                            ? "bg-[#1c1b1b] border-b-[3px] border-[#d4af37]"
                            : "bg-[#1c1b1b] hover:bg-[#2a2a2a]"
                        } ${!day.open ? "opacity-30" : ""}`}
                      >
                        <span
                          className={`block text-[0.65rem] uppercase tracking-widest ${
                            selectedDayIndex === index
                              ? "text-[#d4af37] font-bold"
                              : "text-[#99907c]"
                          }`}
                        >
                          {day.day.substring(0, 3)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Editor */}
                  <div className="p-8 bg-[#131313]">
                    <div className="flex items-center gap-3 flex-wrap mb-8">
                      <h4 className="font-['Manrope'] font-extrabold text-lg">
                        Daily Block Editor: {selectedDay.day}
                      </h4>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                          selectedDay.open
                            ? "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}
                      >
                        {selectedDay.open ? "Main Shop Hours" : "Closed"}
                      </span>
                    </div>

                    {/* Time inputs */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 mb-8 p-4 md:p-6 bg-[#0e0e0e] rounded-2xl border border-[#4d4635]/10 overflow-hidden">
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">
                          Opens
                        </span>
                        <button
                          disabled={!selectedDay.open}
                          onClick={() =>
                            setTimeModal({
                              isOpen: true,
                              type: "open",
                              day: selectedDay.day,
                              time: formatTo12h(selectedDay.openTime),
                            })
                          }
                          className="w-full min-w-0 bg-[#1c1b1b] border border-[#4d4635]/20 rounded-xl px-4 py-2 text-base md:text-lg font-['Manrope'] font-black text-[#e5e2e1] hover:border-[#d4af37]/50 transition-all flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
                        >
                          <span className="material-symbols-outlined text-[#d4af37] shrink-0">
                            schedule
                          </span>
                          <span className="truncate">
                            {formatTo12h(selectedDay.openTime)}
                          </span>
                        </button>
                      </div>
                      <div className="hidden md:block flex-1 h-[2px] border-t-2 border-dashed border-[#d4af37]/20 mt-5" />
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">
                          Closes
                        </span>
                        <button
                          disabled={!selectedDay.open}
                          onClick={() =>
                            setTimeModal({
                              isOpen: true,
                              type: "close",
                              day: selectedDay.day,
                              time: formatTo12h(selectedDay.closeTime),
                            })
                          }
                          className="w-full min-w-0 bg-[#1c1b1b] border border-[#4d4635]/20 rounded-xl px-4 py-2 text-base md:text-lg font-['Manrope'] font-black text-[#e5e2e1] hover:border-[#d4af37]/50 transition-all flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
                        >
                          <span className="material-symbols-outlined text-[#d4af37] shrink-0">
                            schedule
                          </span>
                          <span className="truncate">
                            {formatTo12h(selectedDay.closeTime)}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Time Ruler */}
                    <div className="flex justify-between text-[0.7rem] font-bold tracking-widest text-[#99907c]/60 mb-3 px-1">
                      <span>08AM</span>
                      <span>10AM</span>
                      <span>12PM</span>
                      <span>02PM</span>
                      <span>04PM</span>
                      <span>06PM</span>
                      <span>08PM</span>
                    </div>
                    <div className="relative h-12 w-full bg-[#1c1b1b] rounded-full border border-[#4d4635]/10 flex items-center px-3 mb-8">
                      <div className="h-1 bg-[#4d4635]/20 rounded-full w-[10%]" />
                      <div className="relative h-9 bg-[#d4af37]/10 rounded-full flex-1 border-x-4 border-[#d4af37] flex items-center justify-between px-4">
                        <span className="text-xs font-black text-[#d4af37]">
                          {selectedDay.openTime}
                        </span>
                        <span className="text-xs font-black text-[#d4af37]">
                          {selectedDay.closeTime}
                        </span>
                      </div>
                      <div className="h-1 bg-[#4d4635]/20 rounded-full w-[10%]" />
                    </div>

                    {/* Schedule summary table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-[#4d4635]/10">
                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-[#99907c]">
                              Day
                            </th>
                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-[#99907c]">
                              Operating Hours
                            </th>
                            <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-[#99907c] text-right">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#4d4635]/5">
                          {schedules.map((day, index) => (
                            <tr
                              key={day.dayOfWeek}
                              onClick={() => setSelectedDayIndex(index)}
                              className={`cursor-pointer transition-colors ${
                                selectedDayIndex === index
                                  ? "bg-[#d4af37]/5"
                                  : "hover:bg-[#1c1b1b]/40"
                              }`}
                            >
                              <td
                                className={`py-4 font-extrabold text-sm ${
                                  selectedDayIndex === index
                                    ? "text-[#d4af37]"
                                    : "text-[#e5e2e1]"
                                }`}
                              >
                                {day.day}
                              </td>
                              <td className="py-4 text-sm text-[#99907c]">
                                {day.open
                                  ? `${day.openTime} — ${day.closeTime}`
                                  : "—"}
                              </td>
                              <td className="py-4 text-right">
                                {day.open ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[0.65rem] font-black text-[#d4af37] border border-[#d4af37]/20">
                                    <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
                                    {day.status === "late_night"
                                      ? "LATE NIGHT"
                                      : "OPEN"}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#99907c]/10 text-[0.65rem] font-black text-[#99907c] border border-[#99907c]/20">
                                    <span className="w-1.5 h-1.5 bg-[#99907c] rounded-full"></span>
                                    CLOSED
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <TimePickerModal
        isOpen={timeModal.isOpen}
        type={timeModal.type}
        day={timeModal.day}
        initialTime={timeModal.time}
        onClose={() => setTimeModal((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={(time) => {
          updateTime(
            selectedDayIndex,
            timeModal.type === "open" ? "openTime" : "closeTime",
            formatTo24h(time),
          );
          setTimeModal((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
}

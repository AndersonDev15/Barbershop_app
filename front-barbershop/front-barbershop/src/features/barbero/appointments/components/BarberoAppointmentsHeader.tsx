interface BarberoAppointmentsHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  totalBookings: number;
  estimatedRevenue: string;
}

export default function BarberoAppointmentsHeader({
  selectedDate,
  onDateChange,
  totalBookings,
  estimatedRevenue,
}: BarberoAppointmentsHeaderProps) {
  const today = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === today;

  function formatLongDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatShortMonthDay(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function navigateDate(days: number) {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().split("T")[0]);
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
      {/* Columna izquierda */}
      <div className="flex flex-col gap-6">
        {/* Date navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/10">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-surface-variant rounded-md text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => onDateChange(today)}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-surface-variant rounded-md text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/10 text-on-surface text-sm font-bold rounded-lg focus:ring-primary focus:border-primary pl-4 pr-10 py-2.5 cursor-pointer appearance-none"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              calendar_today
            </span>
          </div>
        </div>

        {/* Títulos */}
        <div>
          <p className="font-label text-sm uppercase tracking-[0.3em] text-primary font-bold mb-2">
            Daily Schedule
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface">
            {isToday
              ? "Today's Appointments"
              : `Appointments - ${formatShortMonthDay(selectedDate)}`}
          </h2>
          <p className="text-on-surface-variant mt-2 text-lg">
            {formatLongDate(selectedDate)}
          </p>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex gap-4 self-start lg:self-end">
        <div className="bg-surface-container-low px-6 py-4 rounded-lg flex flex-col items-end border border-outline-variant/5">
          <span className="text-on-surface-variant text-xs uppercase tracking-widest">
            Total Bookings
          </span>
          <span className="text-3xl font-black text-on-surface">
            {totalBookings}
          </span>
        </div>
        <div className="bg-surface-container-low px-6 py-4 rounded-lg flex flex-col items-end border-l-4 border-primary shadow-lg shadow-primary/5">
          <span className="text-on-surface-variant text-xs uppercase tracking-widest">
            Est. Revenue
          </span>
          <span className="text-3xl font-black text-primary">
            {estimatedRevenue}
          </span>
        </div>
      </div>
    </div>
  );
}

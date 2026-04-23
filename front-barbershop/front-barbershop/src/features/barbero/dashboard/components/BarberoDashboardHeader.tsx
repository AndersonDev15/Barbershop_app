interface BarberoDashboardHeaderProps {
  period: "daily" | "weekly" | "monthly";
  onPeriodChange: (p: "daily" | "weekly" | "monthly") => void;
  onMenuClick?: () => void;
}

export default function BarberoDashboardHeader({
  period,
  onPeriodChange,
  onMenuClick,
}: BarberoDashboardHeaderProps) {
  const options = [
    { value: "daily", label: "Hoy" },
    { value: "weekly", label: "Esta semana" },
    { value: "monthly", label: "Este mes" },
  ] as const;

  return (
    <header className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
      {/* Izquierda */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">
            Performance
          </h1>
          <p className="text-on-surface-variant font-medium uppercase tracking-widest text-[10px] md:text-xs">
            Summary View • November 2023
          </p>
        </div>
      </div>

      {/* Derecha */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
        {/* Toggle */}
        <div className="flex items-center gap-1 md:gap-4 bg-surface-container-low p-1 md:p-2 rounded-full h-fit overflow-x-auto no-scrollbar">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPeriodChange(opt.value)}
              className={`px-3 md:px-6 py-1.5 md:py-2 text-[10px] md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                period === opt.value
                  ? "bg-surface-container-high rounded-full text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

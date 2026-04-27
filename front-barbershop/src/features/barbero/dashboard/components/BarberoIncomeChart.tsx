import { useState } from "react";
import type { DayIncome } from "../../../../types/barberDashboard";

interface BarberoIncomeChartProps {
  data?: DayIncome[];
}

export default function BarberoIncomeChart({ data }: BarberoIncomeChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const bars = data
    ? data.map((d) => {
        const date = new Date(d.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        return {
          day: dayName,
          income: d.income,
          height: `${Math.min(100, (d.income / 1000000) * 100)}%`, // Normalize to some max value, e.g. 1M COP
        };
      })
    : [
        { day: "Mon", income: 650000, height: "65%" },
        { day: "Tue", income: 820000, height: "82%" },
        { day: "Wed", income: 450000, height: "45%" },
        { day: "Thu", income: 950000, height: "95%", highlight: true },
        { day: "Fri", income: 780000, height: "78%" },
        { day: "Sat", income: 880000, height: "88%" },
        { day: "Sun", income: 300000, height: "30%", dim: true },
      ];

  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-lg h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-lg md:text-xl font-headline font-bold text-on-surface">
            Last 7 Days Income
          </h2>
          <p className="text-[10px] md:text-xs text-on-surface-variant uppercase tracking-widest mt-1">
            Daily earnings distribution
          </p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 md:w-3 h-2 md:h-3 bg-primary rounded-full"></div>
          <span className="text-[8px] md:text-[10px] font-bold uppercase text-on-surface">
            Income
          </span>
        </div>
      </div>

      {/* Barras */}
      <div className="flex items-end justify-between h-48 md:h-64 gap-2 md:gap-4 px-2 md:px-4">
        {bars.map((bar, index) => (
          <div
            key={bar.day}
            className="flex-1 flex flex-col items-center gap-3 group h-full relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Tooltip */}
            {hoveredIndex === index && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap bg-surface-container-high text-on-surface text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-outline-variant/10 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                {bar.income === 0 ? "Sin ingresos" : formatCurrency(bar.income)}
                {/* Flecha del tooltip */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-surface-container-high rotate-45 border-r border-b border-outline-variant/10"></div>
              </div>
            )}

            <div className="w-full bg-surface-container-high rounded-t-lg md:rounded-t-xl h-full flex flex-col justify-end overflow-hidden">
              <div
                style={{ height: bar.height }}
                className={`w-full bg-primary-container group-hover:bg-primary transition-all duration-300 rounded-t-lg md:rounded-t-xl ${
                  bar.highlight
                    ? "shadow-[0_0_20px_rgba(242,202,80,0.2)] bg-primary"
                    : ""
                } ${bar.dim ? "opacity-30" : ""}`}
              />
            </div>
            <span
              className={`text-[8px] md:text-[10px] font-bold uppercase ${
                bar.highlight ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {bar.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

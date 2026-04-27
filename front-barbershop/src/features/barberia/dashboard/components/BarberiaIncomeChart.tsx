import type { DashboardData } from "../../types/dashboard.types";

interface BarberiaIncomeChartProps {
  data: DashboardData["weeklyIncome"];
}

export default function BarberiaIncomeChart({
  data,
}: BarberiaIncomeChartProps) {
  // Encontrar el valor máximo para calcular las alturas relativas
  const maxIncome = Math.max(...data.map((item) => item.income), 1);

  // Formatear los datos para las barras
  const bars = data.map((item) => {
    const dayName = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    // Calcular altura porcentual relativa al máximo (mínimo 10% para visibilidad)
    const percentage = Math.max((item.income / maxIncome) * 100, 10);

    return {
      day: dayName,
      income: item.income,
      heightStyle: { height: `${percentage}%` },
      // Resaltar el día con mayor ingreso como ejemplo de "highlight"
      highlight: item.income === maxIncome && item.income > 0,
    };
  });

  return (
    <div className="bg-surface-container rounded-2xl p-8">
      <header className="flex items-center justify-between mb-10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            Last 7 Days Income
          </span>
          <span className="text-on-surface-variant text-xs mt-1">
            Rolling revenue performance monitoring
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Daily Revenue
          </span>
        </div>
      </header>

      <div className="h-64 flex items-end justify-between gap-6 px-4 overflow-x-auto no-scrollbar">
        {bars.map((bar, index) => (
          <div
            key={`${bar.day}-${index}`}
            className="flex-1 flex flex-col items-center gap-4 group min-w-[40px] h-full"
          >
            <div className="flex-1 w-full flex flex-col justify-end">
              <div
                style={bar.heightStyle}
                className={`w-full transition-all duration-500 rounded-t-2xl relative ${
                  bar.highlight
                    ? "bg-[#f2ca50] shadow-lg shadow-[#f2ca50]/20"
                    : "bg-surface-container-highest group-hover:bg-[#f2ca50]/20"
                }`}
              >
                {/* Tooltip simple en hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/5 shadow-xl pointer-events-none">
                  ${bar.income.toLocaleString()}
                </div>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold uppercase shrink-0 ${
                bar.highlight ? "text-[#f2ca50]" : "text-on-surface-variant"
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

import type { DashboardData } from "../../types/dashboard.types";

interface BarberiaMonthlyComparisonProps {
  data: DashboardData["monthlyComparison"];
}

export default function BarberiaMonthlyComparison({
  data,
}: BarberiaMonthlyComparisonProps) {
  const isPositive = data.difference >= 0;

  return (
    <div className="bg-surface-container rounded-2xl p-8 flex flex-col h-full">
      <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-8">
        Monthly Comparison
      </span>

      <div className="flex-1 space-y-8">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
            Current Month
          </p>
          <h3 className="text-4xl font-extrabold font-headline text-on-surface">
            ${data.CurrentMonthIncome.toLocaleString()}
          </h3>
        </div>

        <div className="border-t border-white/5 pt-6">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
            Previous Month
          </p>
          <h3 className="text-2xl font-bold font-headline text-on-surface-variant/80">
            ${data.PreviousMonthIncome.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="border-t border-white/5 pt-8 mt-auto flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
            Difference
          </p>
          <h3
            className={`text-2xl font-bold font-headline ${isPositive ? "text-tertiary" : "text-error"}`}
          >
            {isPositive ? "+" : ""}${data.difference.toLocaleString()}
          </h3>
        </div>
        <div
          className={`px-4 py-2 rounded-full font-black text-sm border ${
            isPositive
              ? "bg-tertiary/10 text-tertiary border-tertiary/20"
              : "bg-error/10 text-error border-error/20"
          }`}
        >
          {isPositive ? "+" : ""}
          {data.percentage}%
        </div>
      </div>
    </div>
  );
}

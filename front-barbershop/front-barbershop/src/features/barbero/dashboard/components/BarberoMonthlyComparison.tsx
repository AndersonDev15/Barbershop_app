import type { MonthlyComparison } from "../../../../types/barberDashboard";

interface BarberoMonthlyComparisonProps {
  comparison?: MonthlyComparison;
}

export default function BarberoMonthlyComparison({
  comparison,
}: BarberoMonthlyComparisonProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-lg h-full group hover:bg-surface-container transition-colors duration-300 border border-primary/5 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg md:text-xl font-headline font-bold text-on-surface">
            Monthly Comparison
          </h2>
          <p className="text-[10px] md:text-xs text-on-surface-variant uppercase tracking-widest mt-1">
            Performance analysis
          </p>
        </div>
        <span className="material-symbols-outlined text-primary-container opacity-50 group-hover:opacity-100 transition-opacity hidden sm:block">
          compare_arrows
        </span>
      </div>

      {/* Body */}
      <div className="space-y-6 md:space-y-8 flex-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Current Month
          </p>
          <div className="text-xl md:text-2xl font-headline font-bold text-on-surface">
            {comparison
              ? formatCurrency(comparison.CurrentMonthIncome)
              : "$5,430.00"}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Previous Month
          </p>
          <div className="text-xl md:text-2xl font-headline font-bold text-on-surface opacity-60">
            {comparison
              ? formatCurrency(comparison.PreviousMonthIncome)
              : "$4,820.00"}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-outline-variant opacity-20" />

        {/* Difference row - COMPACT AND BALANCED */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5 truncate">
              Difference
            </p>
            <div className="text-xl md:text-2xl font-headline font-bold text-tertiary whitespace-nowrap">
              {comparison
                ? (comparison.difference >= 0 ? "+" : "") +
                  formatCurrency(comparison.difference)
                : "+$610.00"}
            </div>
          </div>

          <div className="bg-tertiary/10 px-2.5 py-1.5 rounded-lg border border-tertiary/20 flex items-center gap-1.5 shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-tertiary text-sm md:text-base leading-none">
              {comparison
                ? comparison.difference >= 0
                  ? "trending_up"
                  : "trending_down"
                : "trending_up"}
            </span>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[7px] font-bold uppercase text-tertiary/80 mb-0.5">
                Change
              </span>
              <span className="text-sm md:text-base font-bold text-tertiary">
                {comparison ? comparison.percentage.toFixed(1) + "%" : "12.6%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nota */}
      <div className="p-4 bg-surface-bright rounded-lg border border-primary/10 mt-8">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter leading-relaxed">
          Your current performance is{" "}
          <span className="text-primary font-bold">
            {comparison ? comparison.percentage.toFixed(1) + "%" : "15%"}{" "}
            {comparison
              ? comparison.difference >= 0
                ? "above"
                : "below"
              : "above"}
          </span>{" "}
          the average for this period. Keep maintaining this growth trend.
        </p>
      </div>
    </div>
  );
}

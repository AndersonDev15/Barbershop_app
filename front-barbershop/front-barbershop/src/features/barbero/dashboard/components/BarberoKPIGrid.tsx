import type { PeriodStats } from "../../../../types/barberDashboard";

interface BarberoKPIGridProps {
  stats?: PeriodStats;
}

export default function BarberoKPIGrid({ stats }: BarberoKPIGridProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
    });

  const kpis = [
    {
      label: "Commission",
      value: stats ? formatCurrency(stats.totalCommission) : "$4,280",
      icon: "payments",
      type: "default",
    },
    {
      label: "Total Tips",
      value: stats ? formatCurrency(stats.totalTips) : "$1,150",
      icon: "volunteer_activism",
      type: "default",
    },
    {
      label: "Total Income",
      value: stats ? formatCurrency(stats.totalIncome) : "$5,430",
      badge: "Primary Stream",
      icon: "account_balance_wallet",
      type: "primary",
    },
    {
      label: "Transactions",
      value: stats ? stats.transactionsCount.toString() : "128",
      icon: "sync_alt",
      type: "error",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={`p-5 md:p-6 rounded-lg flex flex-col justify-between h-40 md:h-48 group transition-colors duration-300 ${
            kpi.type === "primary"
              ? "bg-primary-container shadow-lg shadow-primary/10"
              : "bg-surface-container-low hover:bg-surface-container"
          }`}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                kpi.type === "primary"
                  ? "text-on-primary-container"
                  : "text-primary"
              }`}
            >
              {kpi.label}
            </span>
            <span
              className={`material-symbols-outlined text-xl md:text-2xl transition-opacity duration-300 ${
                kpi.type === "primary"
                  ? "text-on-primary-container opacity-70 group-hover:opacity-100"
                  : "text-primary-container opacity-50 group-hover:opacity-100"
              }`}
            >
              {kpi.icon}
            </span>
          </div>

          <div>
            <div
              className={`text-3xl md:text-4xl font-headline font-bold mt-2 md:mt-4 ${
                kpi.type === "primary"
                  ? "text-on-primary-container"
                  : "text-on-surface"
              }`}
            >
              {kpi.value}
            </div>
            {stats && (
              <p className="text-[10px] text-on-surface-variant mt-1">
                {formatDate(stats.startDate)} — {formatDate(stats.endDate)}
              </p>
            )}
            <div className="mt-2">
              {kpi.type === "primary" && (
                <span className="px-2 py-1 bg-on-primary-container/10 rounded-full text-[10px] font-bold text-on-primary-container uppercase tracking-tighter">
                  {kpi.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

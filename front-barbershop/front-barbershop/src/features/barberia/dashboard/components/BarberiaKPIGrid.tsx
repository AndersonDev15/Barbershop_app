import type { DashboardData } from "../../types/dashboard.types";

interface BarberiaKPIGridProps {
  data: Pick<
    DashboardData,
    "totalIncome" | "shopIncome" | "totalCommissions" | "totalTips"
  >;
}

export default function BarberiaKPIGrid({ data }: BarberiaKPIGridProps) {
  const kpis = [
    {
      label: "Total Income",
      value: `$${data.totalIncome.toLocaleString()}`,
      icon: "payments",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Shop Cut",
      value: `$${data.shopIncome.toLocaleString()}`,
      icon: "store",
      iconClass: "bg-tertiary/10 text-tertiary",
    },
    {
      label: "Commissions",
      value: `$${data.totalCommissions.toLocaleString()}`,
      icon: "account_balance_wallet",
      iconClass: "bg-on-surface-variant/10 text-on-surface-variant",
    },
    {
      label: "Total Tips",
      value: `$${data.totalTips.toLocaleString()}`,
      icon: "volunteer_activism",
      iconClass: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-surface-container rounded-2xl p-6 hover:bg-surface-container-high transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
                {kpi.label}
              </span>
              <span className="text-3xl font-bold font-headline text-on-surface">
                {kpi.value}
              </span>
            </div>
            <div
              className={`p-2 rounded-xl flex items-center justify-center ${kpi.iconClass}`}
            >
              <span className="material-symbols-outlined">{kpi.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import type { KpiCardData } from "../../types/dashboard.types";

interface KpiCardProps {
  kpi: KpiCardData;
}

export default function KpiCard({ kpi }: KpiCardProps) {
  return (
    <div className="bg-[#2a2a2a] p-6 rounded-xl hover:bg-[#3a3939] transition-all duration-300 shadow-xl shadow-black/20">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-[#f2ca50]/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[#f2ca50]">
            {kpi.icon}
          </span>
        </div>
        {kpi.trend && (
          <div
            className={`flex items-center gap-1 text-sm font-bold ${kpi.trend.up ? "text-[#3de1fc]" : "text-[#d0c5af]"}`}
          >
            <span className="material-symbols-outlined text-xs">
              {kpi.trend.up ? "trending_up" : "remove"}
            </span>
            {kpi.trend.value}
          </div>
        )}
      </div>
      <p className="text-[#d0c5af] text-xs uppercase tracking-widest mb-1 font-bold">
        {kpi.label}
      </p>
      <div className="flex items-baseline gap-1">
        <h2 className="font-['Manrope'] text-3xl font-extrabold text-[#e5e2e1]">
          {kpi.value}
        </h2>
        {kpi.sub && <span className="text-[#d0c5af]">{kpi.sub}</span>}
      </div>
    </div>
  );
}

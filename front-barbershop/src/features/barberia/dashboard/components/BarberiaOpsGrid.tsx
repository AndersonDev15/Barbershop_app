import type { DashboardData } from "../../types/dashboard.types";

interface BarberiaOpsGridProps {
  data: Pick<DashboardData, "totalTransactions" | "activeBarbers">;
}

export default function BarberiaOpsGrid({ data }: BarberiaOpsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
      {/* Total Transactions */}
      <div className="bg-surface-container rounded-2xl p-6 hover:bg-surface-container-high transition-all border-l-4 border-primary">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
              Total Transactions
            </span>
            <span className="text-3xl font-bold font-headline text-on-surface">
              {data.totalTransactions}
            </span>
          </div>
          <div className="bg-surface-container-highest rounded-xl p-2 flex items-center justify-center">
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
        </div>
      </div>

      {/* Active Barbers */}
      <div className="bg-surface-container rounded-2xl p-6 hover:bg-surface-container-high transition-all">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
              Active Barbers
            </span>
            <span className="text-3xl font-bold font-headline text-on-surface">
              {data.activeBarbers}
            </span>
          </div>
          <div className="bg-tertiary/10 text-tertiary rounded-xl p-2 flex items-center justify-center">
            <span className="material-symbols-outlined">content_cut</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-tertiary mt-4">
          <div className="w-2 h-2 rounded-full bg-tertiary" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            At Full Capacity
          </span>
        </div>
      </div>
    </div>
  );
}

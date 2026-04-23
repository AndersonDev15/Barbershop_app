import { useState } from "react";
import BarberoSidebar from "../../common/components/BarberoSidebar";
import BarberoTopBar from "../../common/components/BarberoTopBar";
import BarberoDashboardHeader from "../components/BarberoDashboardHeader";
import BarberoKPIGrid from "../components/BarberoKPIGrid";
import BarberoIncomeChart from "../components/BarberoIncomeChart";
import BarberoMonthlyComparison from "../components/BarberoMonthlyComparison";
import BarberoEngagementMetrics from "../components/BarberoEngagementMetrics";
import { useBarberDashboard } from "../../../../hooks/useBarberDashboard";

export default function BarberoDashboardPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const { data, loading, error } = useBarberDashboard();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-error">
        {error}
      </div>
    );
  }

  const stats =
    period === "daily"
      ? data?.daily
      : period === "monthly"
        ? data?.monthly
        : data?.weekly;

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <BarberoSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <BarberoTopBar />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 pt-6 md:p-8 lg:p-10">
          <BarberoDashboardHeader period={period} onPeriodChange={setPeriod} />
          <BarberoKPIGrid stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-7">
              <BarberoIncomeChart data={data?.last7days.days} />
            </div>
            <div className="lg:col-span-5">
              <BarberoMonthlyComparison comparison={data?.monthlyComparison} />
            </div>
          </div>
          <BarberoEngagementMetrics workedHours={data?.workedHours} />
        </main>
      </div>
    </div>
  );
}

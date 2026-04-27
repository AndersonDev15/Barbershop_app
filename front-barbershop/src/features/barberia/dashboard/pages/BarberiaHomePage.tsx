import { useState, useEffect } from "react";
import api from "../../../../lib/api";
import type { DashboardData } from "../../types/dashboard.types";
import BarberiaSidebar from "../../common/components/Sidebar";
import BarberiaTopBar from "../../common/components/Topbar";
import BarberiaHomeHeader from "../components/BarberiaHomeHeader";
import BarberiaKPIGrid from "../components/BarberiaKPIGrid";
import BarberiaOpsGrid from "../components/BarberiaOpsGrid";
import BarberiaIncomeChart from "../components/BarberiaIncomeChart";
import BarberiaMonthlyComparison from "../components/BarberiaMonthlyComparison";
import BarberiaTopBarbers from "../components/BarberiaTopBarbers";

export default function BarberiaHomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<DashboardData>(
          "/api/barbershop/dashboard",
        );
        setData(response.data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <BarberiaSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <BarberiaTopBar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          pageTitle="Executive Overview"
        />
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">
                progress_activity
              </span>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">
                Loading dashboard...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <span className="material-symbols-outlined text-5xl text-error">
                error
              </span>
              <p className="text-error font-bold text-center max-w-md">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-surface-container rounded-full text-primary font-bold hover:bg-surface-container-high transition-colors"
              >
                Retry
              </button>
            </div>
          ) : data ? (
            <>
              <BarberiaHomeHeader />
              <BarberiaKPIGrid
                data={{
                  totalIncome: data.totalIncome,
                  shopIncome: data.shopIncome,
                  totalCommissions: data.totalCommissions,
                  totalTips: data.totalTips,
                }}
              />
              <BarberiaOpsGrid
                data={{
                  totalTransactions: data.totalTransactions,
                  activeBarbers: data.activeBarbers,
                }}
              />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <BarberiaIncomeChart data={data.weeklyIncome} />
                </div>
                <div className="lg:col-span-4">
                  <BarberiaMonthlyComparison data={data.monthlyComparison} />
                </div>
              </div>
              <BarberiaTopBarbers data={data.topBarbers} />
            </>
          ) : null}

          <footer className="h-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between mt-auto py-4 md:py-0 gap-4 md:gap-0">
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold text-center md:text-left">
              © 2026 BarberOS. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold hover:text-primary transition-colors"
                href="#"
              >
                Privacy
              </a>
              <a
                className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold hover:text-primary transition-colors"
                href="#"
              >
                Terms
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

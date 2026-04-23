export interface DashboardData {
  totalIncome: number;
  shopIncome: number;
  totalCommissions: number;
  totalTips: number;
  totalTransactions: number;
  activeBarbers: number;
  weeklyIncome: { date: string; income: number }[];
  monthlyComparison: {
    CurrentMonthIncome: number;
    PreviousMonthIncome: number;
    difference: number;
    percentage: number;
  };
  topBarbers: {
    barberId: number;
    barberName: string;
    income: number;
  }[];
}

export interface KpiCardData {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; up: boolean };
}

export interface Barber {
  id: number;
  name: string;
  role: string;
  appointments: number;
  revenue: string;
  avatar: string;
}

export interface Appointment {
  id: number;
  clientName: string;
  service: string;
  time: string;
  barber: string;
  status: "in_chair" | "confirmed" | "pending";
}

export interface ChartBarData {
  day: string;
  height: number;
  active?: boolean;
}

export interface PeriodStats { 
   barberId: number; 
   barberName: string; 
   startDate: string; 
   endDate: string; 
   totalCommission: number; 
   totalTips: number; 
   totalIncome: number; 
   transactionsCount: number; 
 } 
 
 export interface MonthlyComparison { 
   CurrentMonthIncome: number; 
   PreviousMonthIncome: number; 
   difference: number; 
   percentage: number; 
 } 
 
 export interface DayIncome { 
   date: string; 
   income: number; 
 } 
 
 export interface BarberDashboardResponse { 
   barberId: number; 
   barberName: string; 
   daily: PeriodStats; 
   weekly: PeriodStats; 
   monthly: PeriodStats; 
   monthlyComparison: MonthlyComparison; 
   last7days: { days: DayIncome[] }; 
   workedHours: { totalAppointments: number; hours: string }; 
 } 

package com.barber.project.barber.dto.response.report;

import com.barber.project.barber.dto.response.BarberBreakResponse;
import com.barber.project.shared.dto.report.MonthlyComparisonResponse;


public record BarberDashboardResponse(
         Long barberId,
         String barberName,

         BarberBreakResponse.BarberReportResponse daily,
         BarberBreakResponse.BarberReportResponse weekly,
         BarberBreakResponse.BarberReportResponse monthly,

         MonthlyComparisonResponse monthlyComparison,
         Last7DaysResponse last7days,
         WorkedHoursResponse workedHours
) { }

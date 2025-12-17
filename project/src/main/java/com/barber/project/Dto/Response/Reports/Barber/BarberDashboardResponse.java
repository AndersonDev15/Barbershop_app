package com.barber.project.Dto.Response.Reports.Barber;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BarberDashboardResponse {
    private Long barberId;
    private String barberName;

    private BarberReportResponse daily;
    private BarberReportResponse weekly;
    private BarberReportResponse monthly;

    private MonthlyComparisonResponse monthlyComparison;
    private Last7DaysResponse last7days;
    private WorkedHoursResponse workedHours;
}

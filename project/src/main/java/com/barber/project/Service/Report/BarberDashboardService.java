package com.barber.project.Service.Report;

import com.barber.project.Dto.Response.Reports.Barber.*;
import com.barber.project.Entity.Barber;
import com.barber.project.Service.Barber.BarberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BarberDashboardService {
    private final BarberService barberService;
    private final BarberReportService barberReportService;

    public BarberDashboardResponse dashboard(){
        Barber barber = barberService.getAuthenticatedBarber();
        LocalDate today = LocalDate.now();
        String FullName = barber.getUser().getFirstName() + " " + barber.getUser().getLastName();

        //diario
        BarberReportResponse daily = barberReportService.barberDailyReport(today);

        //semanal
        BarberReportResponse weekly = barberReportService.barberWeeklyReport(today);

        //mensual
        BarberReportResponse monthly = barberReportService.barberMonthlyReport(today);

        //comparacion mes actual vs Anterior
        MonthlyComparisonResponse MonthlyComparison = barberReportService.getMonthlyComparison();

        //ultimos 7 dias
        Last7DaysResponse last7Days = barberReportService.last7DaysIncome();

        //horas trabajadas
        WorkedHoursResponse workedHours = barberReportService.workedHours(today);


        return BarberDashboardResponse.builder()
                .barberId(barber.getId())
                .barberName(FullName)
                .daily(daily)
                .weekly(weekly)
                .monthly(monthly)
                .monthlyComparison(MonthlyComparison)
                .last7days(last7Days)
                .workedHours(workedHours)
                .build();
    }


    }


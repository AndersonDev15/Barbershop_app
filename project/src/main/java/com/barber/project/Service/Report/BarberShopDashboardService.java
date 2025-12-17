package com.barber.project.Service.Report;

import com.barber.project.Dto.Response.Reports.BarberShop.*;
import com.barber.project.Dto.Response.Reports.Barber.MonthlyComparisonResponse;
import com.barber.project.Repository.BarberRepository;
import com.barber.project.Service.BarberShop.BarberShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberShopDashboardService {
    private final BarbershopReportService barbershopReportService;
    private final BarberShopService barberShopService;
    private final BarberRepository barberRepository;

    @Transactional(readOnly = true)
    public BarbershopReportResponse  dashboard(){
       Long barbershopId = barberShopService.getAuthenticatedOwnerBarberShop().getId();
       LocalDate today = LocalDate.now();

        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        //datos barberia
        BarberShopIncomeSummary shopIncome = barbershopReportService.calculateBarberShopIncome(
                monthStart, monthEnd);


        //comparacion mensual
        MonthlyComparisonResponse monthlyComparison = barbershopReportService.monthlyComparison(today);
        DailyBarberIncomeResponse dailyBarberIncome = barbershopReportService.dailyReport(today);
        IncomesByBarberResponse weeklyBarberIncome = barbershopReportService.weeklyReport(today);
        IncomesByBarberResponse monthlyBarberIncome = barbershopReportService.monthlyReport(today);

        //top barberos
        List<TopBarberResponse> top = barbershopReportService.topBarbers(monthStart, monthEnd, 3);
        Long activeBarbers = barberRepository.countActiveBarbers(barbershopId);

        return BarbershopReportResponse.builder()
                .totalIncome(shopIncome.getTotalIncome())
                .barberShopIncome(shopIncome.getBarberShopIncome())
                .totalCommissionPaid(shopIncome.getTotalBarberCommission())
                .totalTips(shopIncome.getTotalTips())
                .totalTransactions(shopIncome.getTransactionCount())
                .activeBarbers(activeBarbers)
                .monthlyComparison(monthlyComparison)
                .dailyReport(dailyBarberIncome)
                .weeklyReport(weeklyBarberIncome)
                .monthlyReport(monthlyBarberIncome)
                .topBarbers(top)
                .build();

    }
}

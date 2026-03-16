package com.barber.project.barbershop.service.report;

import com.barber.project.barbershop.dto.response.report.BarberShopIncomeSummary;
import com.barber.project.barbershop.dto.response.report.BarbershopReportResponse;
import com.barber.project.barber.service.BarberService;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.service.BarberShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BarberShopDashboardService {
    private final BarbershopReportService barbershopReportService;
    private final BarberShopService barberShopService;
    private final BarberService barberService;

    @Transactional(readOnly = true)
    public BarbershopReportResponse dashboard(String ownerUuid){
       BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
       LocalDate today = LocalDate.now();
       LocalDate monthStart = today.withDayOfMonth(1);
       LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        BarberShopIncomeSummary shopIncome = barbershopReportService
                .calculateBarberShopIncome(ownerUuid, monthStart, monthEnd);

        return new BarbershopReportResponse(
                shopIncome.totalIncome(),
                shopIncome.barberShopIncome(),
                shopIncome.totalBarberCommission(),
                shopIncome.totalTips(),
                shopIncome.transactionCount(),
                barberService.countActiveBarbers(barberShop.getId()),
                barbershopReportService.monthlyComparison(ownerUuid, today),
                barbershopReportService.monthlyReport(ownerUuid, today),
                barbershopReportService.weeklyReport(ownerUuid, today),
                barbershopReportService.dailyReport(ownerUuid, today),
                barbershopReportService.topBarbers(ownerUuid, monthStart, monthEnd, 3)
        );

    }
}

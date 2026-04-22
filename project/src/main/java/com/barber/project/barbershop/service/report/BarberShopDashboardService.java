package com.barber.project.barbershop.service.report;

import com.barber.project.barber.dto.response.report.DayIncomeResponse;
import com.barber.project.barbershop.dto.response.report.BarberShopIncomeSummary;
import com.barber.project.barbershop.dto.response.report.BarbershopDashboardResponse;
import com.barber.project.barbershop.dto.response.report.BarbershopReportResponse;
import com.barber.project.barber.service.BarberService;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.service.BarberShopService;
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
    private final BarberService barberService;

    @Transactional(readOnly = true)
    public BarbershopDashboardResponse dashboard(String ownerUuid){

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        LocalDate today = LocalDate.now();

        // rango mes actual
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        // 🔹 ingresos del mes (cards principales)
        BarberShopIncomeSummary shopIncome = barbershopReportService
                .calculateBarberShopIncome(ownerUuid, monthStart, monthEnd);

        // 🔹 últimos 7 días (gráfica)
        LocalDate weekStart = today.minusDays(6);

        List<DayIncomeResponse> weeklyIncome =
                barbershopReportService.dailyIncomeRange(ownerUuid, weekStart, today);

        return new BarbershopDashboardResponse(
                shopIncome.totalIncome(),
                shopIncome.barberShopIncome(),
                shopIncome.totalBarberCommission(),
                shopIncome.totalTips(),
                shopIncome.transactionCount(),
                barberService.countActiveBarbers(barberShop.getId()),
                weeklyIncome,
                barbershopReportService.monthlyComparison(ownerUuid, today),
                barbershopReportService.topBarbers(ownerUuid, monthStart, monthEnd, 3)
        );
    }
}

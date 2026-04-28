package com.barber.project.barbershop.service.report;

import com.barber.project.barber.dto.response.report.DayIncomeResponse;
import com.barber.project.barbershop.entity.enums.ReportType;
import com.barber.project.shared.dto.report.MonthlyComparisonResponse;
import com.barber.project.barber.entity.Barber;
import com.barber.project.barber.service.BarberService;
import com.barber.project.barbershop.dto.response.report.*;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.service.BarberShopService;
import com.barber.project.transaction.entity.BarberShopIncome;
import com.barber.project.transaction.service.BarberShopIncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BarbershopReportService {
    private final BarberShopIncomeService barberShopIncomeService;
    private final BarberShopService barberShopService;
    private final BarberService barberService;

    //rango de fecha (todos los barberos)
    @Transactional(readOnly = true)
    public IncomesByBarberResponse incomesByDateRange(UUID ownerUuid, LocalDate start, LocalDate end){

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        List<BarberShopIncome> incomes = barberShopIncomeService.
                findByBarbershopIdAndDateRange(barberShop.getId(),start,end);

        //por barbero
        Map<Long, List<BarberShopIncome>> grouped = incomes.stream()
                .collect(Collectors.groupingBy(BarberShopIncome::getBarberId));


        List<BarberIncomeItem> results = grouped.entrySet().stream()
                .map(entry -> buildBarberIncomeItem(entry.getKey(), entry.getValue()))
                .toList();

        return new IncomesByBarberResponse(start, end, results);
    }

    //reporte diario
    @Transactional(readOnly = true)
    public DailyBarberIncomeResponse dailyReport(UUID ownerUuid, LocalDate date) {
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);


        List<BarberShopIncome> dailyIncomes  = barberShopIncomeService.findByBarbershopIdAndDate(barberShop.getId(), date);

        Map<Long, List<BarberShopIncome>> grouped = dailyIncomes.stream()
                .collect(Collectors.groupingBy(BarberShopIncome::getBarberId));

        List<DailyIncomeItem> items = grouped.entrySet().stream()
                .map(entry -> {
                    Barber barber = barberService.getBarberById(entry.getKey());
                    String barberName = barber.getUser().getFirstName() + " " + barber.getUser().getLastName();

                    BigDecimal dailyIncome = entry.getValue().stream()
                            .map(BarberShopIncome::getBarberAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return new DailyIncomeItem(entry.getKey(), barberName, dailyIncome);
                })
                .toList();

        return new DailyBarberIncomeResponse(date, items);

    }


    @Transactional(readOnly = true)
    public ReportResponse getReport(UUID ownerUuid, ReportType type, LocalDate referenceDate) {

        LocalDate date = referenceDate != null ? referenceDate : LocalDate.now();

        LocalDate start;
        LocalDate end;

        switch (type) {
            case WEEKLY -> {
                start = date.with(DayOfWeek.MONDAY);
                end = date.with(DayOfWeek.SUNDAY);
            }
            case MONTHLY -> {
                start = date.withDayOfMonth(1);
                end = date.withDayOfMonth(date.lengthOfMonth());
            }
            case YEARLY -> {
                start = date.withDayOfYear(1);
                end = date.withDayOfYear(date.lengthOfYear());
            }
            default -> throw new IllegalArgumentException("Invalid report type");
        }

        // 🔹 reutilizas TODO lo que ya hiciste
        BarberShopIncomeSummary summary =
                calculateBarberShopIncome(ownerUuid, start, end);

        IncomesByBarberResponse byBarber =
                incomesByDateRange(ownerUuid, start, end);

        List<DayIncomeResponse> timeline =
                dailyIncomeRange(ownerUuid, start, end);

        return new ReportResponse(
                start,
                end,
                summary.totalIncome(),
                summary.barberShopIncome(),
                summary.totalBarberCommission(),
                summary.totalTips(),
                summary.transactionCount(),
                byBarber.barbers(),
                timeline
        );
    }

    //comparacion mes actual vs mes pasado
    @Transactional(readOnly = true)
    public MonthlyComparisonResponse monthlyComparison(UUID ownerUuid,LocalDate today){

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        LocalDate currentStart = today.withDayOfMonth(1);
        LocalDate currentEnd = today.withDayOfMonth(today.lengthOfMonth());
        LocalDate previousStart = currentStart.minusMonths(1);
        LocalDate previousEnd = previousStart.withDayOfMonth(previousStart.lengthOfMonth());

        BigDecimal currentMonthIncome = sumTotalAmount(
                barberShopIncomeService.findByBarbershopIdAndDateRange(barberShop.getId(), currentStart, currentEnd)
        );
        BigDecimal previousMonthIncome = sumTotalAmount(
                barberShopIncomeService.findByBarbershopIdAndDateRange(barberShop.getId(), previousStart, previousEnd)
        );


        BigDecimal difference = currentMonthIncome.subtract(previousMonthIncome);

        BigDecimal percentage = previousMonthIncome.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : difference.multiply(BigDecimal.valueOf(100))
                .divide(previousMonthIncome, 2, RoundingMode.HALF_UP);




        return new MonthlyComparisonResponse(
                currentMonthIncome,
                previousMonthIncome,
                difference,
                percentage
        );

    }

    //top barberos
    @Transactional(readOnly = true)
    public List<TopBarberResponse> topBarbers(UUID ownerUuid, LocalDate start, LocalDate end, int limit) {
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        return barberShopIncomeService.findTopBarberIds(barberShop.getId(), start, end, limit)
                .stream()
                .map(barberIncome -> {
                    Barber barber = barberService.getBarberById(barberIncome.getBarberId());
                    String barberName = barber.getUser().getFirstName() + " " + barber.getUser().getLastName();

                    return new TopBarberResponse(
                            barberIncome.getBarberId(),
                            barberName,
                            barberIncome.getTotal()
                    );
                })
                .toList();
    }

    //ingresos barberia
    @Transactional(readOnly = true)
    public BarberShopIncomeSummary calculateBarberShopIncome(UUID ownerUuid, LocalDate start, LocalDate end){

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        List<BarberShopIncome> incomes = barberShopIncomeService.findByBarbershopIdAndDateRange(
                barberShop.getId(), start, end);

        //calcular totales
        BigDecimal totalIncome = sumTotalAmount(incomes);
        BigDecimal barberShopShare = incomes.stream()
                .map(BarberShopIncome::getBarberShopAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal barberShare = incomes.stream()
                .map(BarberShopIncome::getBarberAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalTips = incomes.stream()
                .map(BarberShopIncome::getTipAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new BarberShopIncomeSummary(
                totalIncome,
                barberShopShare,
                barberShare,
                totalTips,
                (long) incomes.size()
        );
    }

    //ultimos 7 dias
    @Transactional(readOnly = true)
    public List<DayIncomeResponse> dailyIncomeRange(UUID ownerUuid, LocalDate start, LocalDate end) {

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        List<BarberShopIncome> incomes =
                barberShopIncomeService.findByBarbershopIdAndDateRange(barberShop.getId(), start, end);

        Map<LocalDate, BigDecimal> grouped = incomes.stream()
                .collect(Collectors.groupingBy(
                        income -> income.getTransactionDate().toLocalDate(),
                        Collectors.mapping(
                                BarberShopIncome::getTotalAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));
        // completar días sin datos
        List<DayIncomeResponse> result = new ArrayList<>();

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            result.add(new DayIncomeResponse(
                    date,
                    grouped.getOrDefault(date, BigDecimal.ZERO)
            ));
        }

        return result;
    }

    private BigDecimal sumTotalAmount(List<BarberShopIncome> incomes) {
        return incomes.stream()
                .map(BarberShopIncome::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BarberIncomeItem buildBarberIncomeItem(Long barberId, List<BarberShopIncome> barberIncomes) {
        Barber barber = barberService.getBarberById(barberId);
        String barberName = barber.getUser().getFirstName() + " " + barber.getUser().getLastName();

        BigDecimal totalCommission = barberIncomes.stream()
                .map(BarberShopIncome::getBarberAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTips = barberIncomes.stream()
                .map(BarberShopIncome::getTipAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new BarberIncomeItem(
                barberId,
                barberName,
                totalCommission,
                totalTips,
                totalCommission.add(totalTips),
                (long) barberIncomes.size()
        );


}

}





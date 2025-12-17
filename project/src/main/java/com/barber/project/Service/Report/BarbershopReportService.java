package com.barber.project.Service.Report;

import com.barber.project.Dto.Response.Reports.BarberShop.*;
import com.barber.project.Dto.Response.Reports.Barber.MonthlyComparisonResponse;
import com.barber.project.Entity.Barber;
import com.barber.project.Entity.BarberShopIncome;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberRepository;
import com.barber.project.Repository.BarberShopIncomeRepository;
import com.barber.project.Service.BarberShop.BarberShopService;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BarbershopReportService {
    private final BarberShopIncomeRepository barberShopIncomeRepository;
    private final BarberRepository barberRepository;
    private final BarberShopService barberShopService;

    //rango de fecha (todos los barberos)
    public IncomesByBarberResponse incomesByDateRange(LocalDate start, LocalDate end){

        Long barbershopId = getAuthBarbershopId();

        List<BarberShopIncome> incomes = barberShopIncomeRepository.findByBarbershopIdAndDateRange(barbershopId,start,end);

        //por barbero
        Map<Long, List<BarberShopIncome>> grouped = incomes.stream()
                .collect(Collectors.groupingBy(BarberShopIncome::getBarberId));


        List<BarberIncomeItem>results = new ArrayList<>();
        for(Map.Entry<Long,List<BarberShopIncome>> entry: grouped.entrySet()){
            Long barberId = entry.getKey();
            List<BarberShopIncome> barberIncomes = entry.getValue();

            //calcular totales
            BigDecimal totalCommission = barberIncomes.stream()
                    .map(BarberShopIncome::getBarberAmount)
                    .reduce(BigDecimal.ZERO,BigDecimal::add);
            BigDecimal totalTips = barberIncomes.stream()
                    .map(BarberShopIncome::getTipAmount)
                    .reduce(BigDecimal.ZERO,BigDecimal::add);

            Barber barber = barberRepository.findById(barberId)
                    .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));

            String fullName = barber.getUser().getFirstName() + " " + barber.getUser().getLastName();

            results.add(BarberIncomeItem.builder()
                    .barberId(barberId)
                    .barberName(fullName)
                    .totalCommission(totalCommission)
                    .totalTips(totalTips)
                    .totalIncome(totalCommission.add(totalTips))
                    .transactionsCount((long) barberIncomes.size())
                    .build());
        }
        return IncomesByBarberResponse.builder()
                .startDate(start)
                .endDate(end)
                .barbers(results)
                .build();
    }

    //reporte diario
    @Transactional(readOnly = true)
    public DailyBarberIncomeResponse dailyReport(LocalDate date) {
        Long barbershopId  = getAuthBarbershopId();

        List<BarberShopIncome> dailyIncomes  = barberShopIncomeRepository.findByBarbershopIdAndDate(barbershopId, date);

        Map<Long, List<BarberShopIncome>> grouped = dailyIncomes.stream()
                .collect(Collectors.groupingBy(BarberShopIncome::getBarberId));

        List<DailyIncomeItem> items = new ArrayList<>();

        for (Map.Entry<Long,List<BarberShopIncome>> entry: grouped.entrySet()){
            Long barberId = entry.getKey();
            List<BarberShopIncome> barberIncomes = entry.getValue();

            //ingresos del barbero
            BigDecimal dailyIncome = barberIncomes.stream()
                    .map(BarberShopIncome::getBarberAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Obtener nombre
            Barber barber = barberRepository.findById(barberId)
                    .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));

            String fullName = barber.getUser().getFirstName() + " " + barber.getUser().getLastName();

            items.add(DailyIncomeItem.builder()
                    .barberId(barberId)
                    .barberName(fullName)
                    .income(dailyIncome)
                    .build());

        }

        return DailyBarberIncomeResponse.builder()
                .date(date)
                .barbers(items)
                .build();
    }

    //reporte semanal
    @Transactional(readOnly = true)
    public IncomesByBarberResponse weeklyReport(LocalDate anyDayInWeek){
        LocalDate startOfWeek = anyDayInWeek.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = anyDayInWeek.with(DayOfWeek.SUNDAY);
        return incomesByDateRange(startOfWeek, endOfWeek);
    }

    //reporte mensual
    @Transactional(readOnly = true)
    public IncomesByBarberResponse monthlyReport(LocalDate anyDayInMonth){
        LocalDate start = anyDayInMonth.withDayOfMonth(1);
        LocalDate end = anyDayInMonth.withDayOfMonth(anyDayInMonth.lengthOfMonth());
        return incomesByDateRange(start, end);
    }

    //comparacion mes actual vs mes pasado
    @Transactional(readOnly = true)
    public MonthlyComparisonResponse monthlyComparison(LocalDate today){

        Long barbershopId = getAuthBarbershopId();

        //mes actual

        LocalDate currentStart = today.withDayOfMonth(1);
        LocalDate currentEnd = today.withDayOfMonth(today.lengthOfMonth());

        List<BarberShopIncome> currentIncome = barberShopIncomeRepository.findByBarbershopIdAndDateRange(barbershopId,currentStart,currentEnd);

        BigDecimal currentMonthIncome = currentIncome.stream()
                .map(BarberShopIncome::getTotalAmount)
                .reduce(BigDecimal.ZERO,BigDecimal::add);

        //mes anterior

        LocalDate previousStart = currentStart.minusMonths(1);
        LocalDate previousEnd = previousStart.withDayOfMonth(previousStart.lengthOfMonth());

        List<BarberShopIncome> previousIncomes = barberShopIncomeRepository.findByBarbershopIdAndDateRange(
                barbershopId, previousStart, previousEnd);

        BigDecimal previousMonthIncome = previousIncomes.stream()
                .map(BarberShopIncome::getTotalAmount)
                .reduce(BigDecimal.ZERO,BigDecimal::add);


        BigDecimal difference = currentMonthIncome.subtract(previousMonthIncome);

        BigDecimal percentage = BigDecimal.ZERO;
        if(previousMonthIncome.compareTo(BigDecimal.ZERO)!=0){
            percentage = difference.multiply(BigDecimal.valueOf(100))
                    .divide(previousMonthIncome,2,RoundingMode.HALF_UP);
        }



        return MonthlyComparisonResponse.builder()
                .CurrentMonthIncome(currentMonthIncome)
                .PreviousMonthIncome(previousMonthIncome)
                .difference(difference)
                .percentage(percentage)
                .build();

    }




    //top barberos
    @Transactional(readOnly = true)
    public List<TopBarberResponse> topBarbers(LocalDate start, LocalDate end, int limit) {
        Long barbershopId = getAuthBarbershopId();

        //barberos con más ingresos
        List<BarberIncomeSummary> topBarberIds = barberShopIncomeRepository.findTopBarberIds(
                barbershopId, start, end, limit);

        // Obtener nombres de esos barberos
        return topBarberIds.stream()
                .map(barberIncome -> {
                    Long barberId = barberIncome.getBarberId();
                    BigDecimal totalIncome = barberIncome.getTotal();

                    Barber barber = barberRepository.findById(barberId)
                            .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));

                    String fullName = barber.getUser().getFirstName() + " " +
                            barber.getUser().getLastName();

                    return TopBarberResponse.builder()
                            .barberId(barberId)
                            .barberName(fullName)
                            .income(totalIncome)
                            .build();
                })
                .toList();
    }

    //ingresos barberia
    @Transactional(readOnly = true)
    public BarberShopIncomeSummary  calculateBarberShopIncome(LocalDate start,LocalDate end){

        Long barbershopId = getAuthBarbershopId();

        List<BarberShopIncome> incomes = barberShopIncomeRepository.findByBarbershopIdAndDateRange(
                barbershopId, start, end);

        //calcular totales
        BigDecimal totalIncome = incomes.stream()
                .map(BarberShopIncome::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal barberShopShare = incomes.stream()
                .map(BarberShopIncome::getBarberShopAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal barberShare = incomes.stream()
                .map(BarberShopIncome::getBarberAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTips = incomes.stream()
                .map(BarberShopIncome::getTipAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long transactionCount = incomes.size();
        return BarberShopIncomeSummary.builder()
                .totalIncome(totalIncome)
                .barberShopIncome(barberShopShare)
                .totalBarberCommission(barberShare)
                .totalTips(totalTips)
                .transactionCount(transactionCount)
                .build();
    }

    public BigDecimal sumIncome(IncomesByBarberResponse response) {
        return response.getBarbers().stream()
                .map(BarberIncomeItem::getTotalIncome)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Long getAuthBarbershopId() {
        return barberShopService.getAuthenticatedOwnerBarberShop().getId();
    }
}

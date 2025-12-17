package com.barber.project.Service.Report;

import com.barber.project.Dto.Response.Reports.Barber.*;
import com.barber.project.Entity.Barber;
import com.barber.project.Entity.Transaction;
import com.barber.project.Repository.TransactionRepository;
import com.barber.project.Service.Barber.BarberService;
import com.barber.project.Service.Reservation.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberReportService {
    private final TransactionRepository transactionRepository;
    private final ReservationService reservationService;
    private final BarberService barberService;

    @Transactional(readOnly = true)
    public BarberReportResponse barberReport(LocalDate startDate, LocalDate endDate){
        Barber barber = barberService.getAuthenticatedBarber();
        Long barberId = barber.getId();

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        List<Transaction> transactions = transactionRepository.findCompletedByBarberAndDateRange(
                barberId,
                start,
                end
        );
        BigDecimal totalCommision = transactions.stream()
                .map(Transaction::getBarberCommission)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTips = transactions.stream()
                .map(Transaction::getTip)
                .reduce(BigDecimal.ZERO,BigDecimal::add);
        BigDecimal totalIncome = totalCommision.add(totalTips);

        return mapToResponse(barber,totalCommision,totalIncome,totalTips,transactions,startDate,endDate);

    }

    //diario
    @Transactional(readOnly = true)
    public BarberReportResponse barberDailyReport(LocalDate date) {
        return barberReport(date, date);
    }

    //semanal
    @Transactional(readOnly = true)
    public BarberReportResponse barberWeeklyReport(LocalDate anyDateInWeek){
        LocalDate startOfWeek = anyDateInWeek.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = anyDateInWeek.with(DayOfWeek.SUNDAY);
        return barberReport(startOfWeek,endOfWeek);
    }

    //mensual
    @Transactional(readOnly = true)
    public BarberReportResponse barberMonthlyReport(LocalDate anyDateInMonth){
        LocalDate firstDay = anyDateInMonth.withDayOfMonth(1);
        LocalDate lastDay = anyDateInMonth.withDayOfMonth(anyDateInMonth.lengthOfMonth());
        return barberReport(firstDay,lastDay);
    }

    //comparacion mes actual vs mes anterior
    @Transactional(readOnly = true)
    public MonthlyComparisonResponse getMonthlyComparison(){
        Barber barber = barberService.getAuthenticatedBarber();
        Long barberId = barber.getId();

        LocalDate today = LocalDate.now();

        LocalDate currentStart = today.withDayOfMonth(1);
        LocalDate currentEnd = today.withDayOfMonth(today.lengthOfMonth());

        LocalDate previousStart = currentStart.minusMonths(1);
        LocalDate previousEnd = previousStart.withDayOfMonth(previousStart.lengthOfMonth());

        BarberReportResponse currentIncome = barberReport(currentStart,currentEnd);
        BarberReportResponse previousIncome = barberReport(previousStart,previousEnd);

        BigDecimal difference = currentIncome.getTotalIncome().subtract(previousIncome.getTotalIncome());
        BigDecimal percent = previousIncome.getTotalIncome().compareTo(BigDecimal.ZERO)==0
                ? BigDecimal.ZERO
                : difference.multiply(BigDecimal.valueOf(100))
                .divide((previousIncome.getTotalIncome()),2, RoundingMode.HALF_UP);

        return MonthlyComparisonResponse.builder()
                .CurrentMonthIncome(currentIncome.getTotalIncome())
                .PreviousMonthIncome(previousIncome.getTotalIncome())
                .difference(difference)
                .percentage(percent)
                .build();

    }

    //ingresos ultimos 7 dias
    @Transactional(readOnly = true)
    public Last7DaysResponse last7DaysIncome(){
        Barber barber = barberService.getAuthenticatedBarber();
        Long barberId = barber.getId();
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);
        List<DayIncomeResponse> days = new ArrayList<>();

        for (int i=0; i<7;i++){
            LocalDate day = start.plusDays(i);
            BarberReportResponse daily = barberDailyReport(day);

            days.add(
                   DayIncomeResponse.builder()
                           .date(day)
                           .income(daily.getTotalIncome())
                           .build()
            );

        }
        return Last7DaysResponse.builder()
                .days(days)
                .build();
    }

    //horas trabajadas
    @Transactional(readOnly = true)
    public WorkedHoursResponse workedHours(LocalDate anyDateInMonth){
        Barber barber =barberService.getAuthenticatedBarber();
        Long barberId = barber.getId();
        LocalDate firstDay = anyDateInMonth.withDayOfMonth(1);
        LocalDate lastDay = anyDateInMonth.withDayOfMonth(anyDateInMonth.lengthOfMonth());

        List<Transaction> transactions = transactionRepository.findCompletedByBarberAndDateRange(
                barberId,
                firstDay.atStartOfDay(),
                lastDay.atTime(LocalTime.MAX)
        );

        int totalAppointments = transactions.size();

        Long totalMinutes = transactions.stream()
                .map(transaction -> reservationService.calculateDuration(transaction.getReservation()).toMinutes())
                .reduce(0L,Long::sum);

        Long totalHour = totalMinutes/60;
        Long remainingMinutes = totalMinutes %60;
        String hours = totalHour + "h" + remainingMinutes + "m";

        return WorkedHoursResponse.builder()
                .totalAppointments(totalAppointments)
                .hours(hours)
                .build();
    }



    

    private BarberReportResponse mapToResponse(Barber barber, BigDecimal totalCommision, BigDecimal totalIncome, BigDecimal totalTips,  List<Transaction> transactions,LocalDate start, LocalDate end){
        Long barberId = barber.getId();
        String FullName = barber.getUser().getFirstName() + " " + barber.getUser().getLastName();
        return BarberReportResponse.builder()
                .barberId(barberId)
                .barberName(FullName)
                .startDate(start)
                .endDate(end)
                .totalCommission(totalCommision)
                .totalIncome(totalIncome)
                .totalTips(totalTips)
                .transactionsCount(transactions.size())
                .build();
    }
}

package com.barber.project.barber.service.report;

import com.barber.project.barber.dto.response.BarberBreakResponse;
import com.barber.project.barber.dto.response.report.DayIncomeResponse;
import com.barber.project.barber.dto.response.report.Last7DaysResponse;
import com.barber.project.shared.dto.report.MonthlyComparisonResponse;
import com.barber.project.barber.dto.response.report.WorkedHoursResponse;
import com.barber.project.barber.entity.Barber;
import com.barber.project.transaction.entity.Transaction;
import com.barber.project.barber.service.BarberService;
import com.barber.project.reservation.service.ReservationService;
import com.barber.project.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class BarberReportService {
    private final TransactionService transactionService;
    private final ReservationService reservationService;
    private final BarberService barberService;

    @Transactional(readOnly = true)
    public BarberBreakResponse.BarberReportResponse barberReport(UUID userUuid, LocalDate startDate, LocalDate endDate){
        Barber barber = barberService.getBarberByUserUuid(userUuid);

        List<Transaction> transactions = transactionService.findCompletedByBarberAndDateRange(
                barber.getId(),
                startDate.atStartOfDay(),
                endDate.atTime(LocalTime.MAX)
        );
        BigDecimal totalCommission = transactions.stream()
                .map(Transaction::getBarberCommission)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTips = transactions.stream()
                .map(Transaction::getTip)
                .reduce(BigDecimal.ZERO,BigDecimal::add);


        return new BarberBreakResponse.BarberReportResponse(
                barber.getId(),
                barber.getUser().getFirstName() + " " + barber.getUser().getLastName(), // barberName
                startDate,
                endDate,
                totalCommission,
                totalTips,
                totalCommission.add(totalTips),
                transactions.size()
        );

    }


    //diario
    @Transactional(readOnly = true)
    public BarberBreakResponse.BarberReportResponse barberDailyReport(UUID userUuid, LocalDate date) {
        return barberReport(userUuid,date, date);
    }

    //semanal
    @Transactional(readOnly = true)
    public BarberBreakResponse.BarberReportResponse barberWeeklyReport(UUID userUuid, LocalDate anyDateInWeek){
        return barberReport(
                userUuid,
                anyDateInWeek.with(DayOfWeek.MONDAY),
                anyDateInWeek.with(DayOfWeek.SUNDAY)
        );
    }

    //mensual
    @Transactional(readOnly = true)
    public BarberBreakResponse.BarberReportResponse barberMonthlyReport(UUID userUuid, LocalDate anyDateInMonth){
        return barberReport(
                userUuid,
                anyDateInMonth.withDayOfMonth(1),
                anyDateInMonth.withDayOfMonth(anyDateInMonth.lengthOfMonth())
        );
    }

    //comparacion mes actual vs mes anterior
    @Transactional(readOnly = true)
    public MonthlyComparisonResponse getMonthlyComparison(UUID userUuid){

        LocalDate today = LocalDate.now();
        LocalDate currentStart = today.withDayOfMonth(1);
        LocalDate currentEnd = today.withDayOfMonth(today.lengthOfMonth());

        LocalDate previousStart = currentStart.minusMonths(1);
        LocalDate previousEnd = previousStart.withDayOfMonth(previousStart.lengthOfMonth());

        BarberBreakResponse.BarberReportResponse currentIncome = barberReport(userUuid,currentStart,currentEnd);
        BarberBreakResponse.BarberReportResponse previousIncome = barberReport(userUuid,previousStart,previousEnd);

        BigDecimal difference = currentIncome.totalIncome().subtract(previousIncome.totalIncome());
        BigDecimal percent = previousIncome.totalIncome().compareTo(BigDecimal.ZERO)==0
                ? BigDecimal.ZERO
                : difference.multiply(BigDecimal.valueOf(100))
                .divide((previousIncome.totalIncome()),2, RoundingMode.HALF_UP);

        return new MonthlyComparisonResponse(
                currentIncome.totalIncome(),
                previousIncome.totalIncome(),
                difference,
                percent
        );

    }

    //ingresos ultimos 7 dias
    @Transactional(readOnly = true)
    public Last7DaysResponse last7DaysIncome(UUID userUuid){
        Barber barber = barberService.getBarberByUserUuid(userUuid);
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);

        List<Transaction> transactions = transactionService.findCompletedByBarberAndDateRange(
                barber.getId(),
                start.atStartOfDay(),
                today.atTime(LocalTime.MAX)
        );


        Map<LocalDate, List<Transaction>> byDay = transactions.stream()
                .collect(Collectors.groupingBy(t -> t.getPaymentDate().toLocalDate()));

        List<DayIncomeResponse> days = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate day = start.plusDays(i);
            List<Transaction> dayTransactions = byDay.getOrDefault(day, List.of());

            BigDecimal income = dayTransactions.stream()
                    .map(t -> t.getBarberCommission().add(
                            t.getTip() != null ? t.getTip() : BigDecimal.ZERO))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            days.add(new DayIncomeResponse(day, income));
        }
        return new Last7DaysResponse(days);
    }

    //horas trabajadas
    @Transactional(readOnly = true)
    public WorkedHoursResponse workedHours(UUID userUuid, LocalDate anyDateInMonth){
        Barber barber =barberService.getBarberByUserUuid(userUuid);
        LocalDate firstDay = anyDateInMonth.withDayOfMonth(1);
        LocalDate lastDay = anyDateInMonth.withDayOfMonth(anyDateInMonth.lengthOfMonth());

        List<Transaction> transactions = transactionService.findCompletedByBarberAndDateRange(
                barber.getId(),
                firstDay.atStartOfDay(),
                lastDay.atTime(LocalTime.MAX)
        );


        long totalMinutes = transactions.stream()
                .map(t -> reservationService.calculateDuration(t.getReservation()).toMinutes())
                .reduce(0L, Long::sum);

        long totalHours = totalMinutes / 60;
        long remainingMinutes = totalMinutes % 60;

        return new WorkedHoursResponse(
                transactions.size(),
                totalHours + "h" + remainingMinutes + "m"
        );
    }


}


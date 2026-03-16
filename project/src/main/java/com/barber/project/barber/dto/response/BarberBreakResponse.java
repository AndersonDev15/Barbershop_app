package com.barber.project.barber.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
public record BarberBreakResponse(
        Long id,
        LocalTime start,
        LocalTime end,
        LocalDate date,
        String barberName
) {
    public static record BarberReportResponse(
             Long barberId,
             String barberName,

             LocalDate startDate,
             LocalDate endDate,

             BigDecimal totalCommission,
             BigDecimal totalTips,
             BigDecimal totalIncome,

             int transactionsCount
    ) {

    }
}

package com.barber.project.barbershop.dto.response.report;

import com.barber.project.barber.dto.response.report.DayIncomeResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ReportResponse(
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalIncome,
        BigDecimal shopIncome,
        BigDecimal totalCommissions,
        BigDecimal totalTips,
        Long totalTransactions,
        List<BarberIncomeItem> barbers,
        List<DayIncomeResponse> timeline
) {}

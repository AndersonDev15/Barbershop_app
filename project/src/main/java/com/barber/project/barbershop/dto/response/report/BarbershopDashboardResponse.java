package com.barber.project.barbershop.dto.response.report;

import com.barber.project.barber.dto.response.report.DayIncomeResponse;
import com.barber.project.shared.dto.report.MonthlyComparisonResponse;

import java.math.BigDecimal;
import java.util.List;

public record BarbershopDashboardResponse(
        BigDecimal totalIncome,
        BigDecimal shopIncome,
        BigDecimal totalCommissions,
        BigDecimal totalTips,
        Long totalTransactions,
        Long activeBarbers,
        List<DayIncomeResponse> weeklyIncome,
        MonthlyComparisonResponse monthlyComparison,
        List<TopBarberResponse> topBarbers
) {}

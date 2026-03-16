package com.barber.project.barbershop.dto.response.report;

import java.math.BigDecimal;


public record BarberIncomeItem(
         Long barberId,
         String barberName,
         BigDecimal totalCommission,
         BigDecimal totalTips,
         BigDecimal totalIncome,
         Long transactionsCount
) { }

package com.barber.project.barbershop.dto.response.report;

import java.math.BigDecimal;


public record BarberShopIncomeSummary(
         BigDecimal totalIncome,
         BigDecimal barberShopIncome,
         BigDecimal totalBarberCommission,
         BigDecimal totalTips,
         Long transactionCount
)  { }


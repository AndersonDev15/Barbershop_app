package com.barber.project.Dto.Response.Reports.BarberShop;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BarberShopIncomeSummary {
    private BigDecimal totalIncome;          // total_amount sum
    private BigDecimal barberShopIncome;      // barbershop_share_amount sum
    private BigDecimal totalBarberCommission; // barber_share_amount sum
    private BigDecimal totalTips;             // tip_amount sum
    private Long transactionCount;
}


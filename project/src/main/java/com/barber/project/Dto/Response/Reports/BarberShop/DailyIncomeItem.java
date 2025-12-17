package com.barber.project.Dto.Response.Reports.BarberShop;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DailyIncomeItem {
    private Long barberId;
    private String barberName;
    private BigDecimal income;
}

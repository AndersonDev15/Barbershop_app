package com.barber.project.Dto.Response.Reports.Barber;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class BarberReportResponse {
    private Long barberId;
    private String barberName;

    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal totalCommission;
    private BigDecimal totalTips;
    private BigDecimal totalIncome;

    private int transactionsCount;
}

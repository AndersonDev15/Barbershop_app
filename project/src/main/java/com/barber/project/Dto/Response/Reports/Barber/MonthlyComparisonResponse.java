package com.barber.project.Dto.Response.Reports.Barber;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class MonthlyComparisonResponse {
    private BigDecimal CurrentMonthIncome;
    private BigDecimal PreviousMonthIncome;
    private BigDecimal difference;
    private BigDecimal percentage;

}

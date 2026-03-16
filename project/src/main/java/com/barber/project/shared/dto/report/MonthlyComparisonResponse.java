package com.barber.project.shared.dto.report;

import java.math.BigDecimal;


public record MonthlyComparisonResponse(
         BigDecimal CurrentMonthIncome,
         BigDecimal PreviousMonthIncome,
         BigDecimal difference,
         BigDecimal percentage
) {


}

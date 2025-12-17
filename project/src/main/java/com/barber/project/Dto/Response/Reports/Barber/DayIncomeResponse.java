package com.barber.project.Dto.Response.Reports.Barber;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class DayIncomeResponse {
    private LocalDate date;
    private BigDecimal income;
}

package com.barber.project.barber.dto.response.report;

import java.math.BigDecimal;
import java.time.LocalDate;


public record DayIncomeResponse (
         LocalDate date,
         BigDecimal income
) { }

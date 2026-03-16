package com.barber.project.barbershop.dto.response.report;

import java.math.BigDecimal;


public record DailyIncomeItem(
         Long barberId,
         String barberName,
         BigDecimal income
) { }

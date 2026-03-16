package com.barber.project.barbershop.dto.response.report;

import java.time.LocalDate;
import java.util.List;


public record DailyBarberIncomeResponse(
        LocalDate date,
         List<DailyIncomeItem> barbers
) { }

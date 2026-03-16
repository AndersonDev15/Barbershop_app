package com.barber.project.barbershop.dto.response.report;



import java.time.LocalDate;
import java.util.List;


public record IncomesByBarberResponse(
         LocalDate startDate,
         LocalDate endDate,
         List<BarberIncomeItem> barbers
) {

}

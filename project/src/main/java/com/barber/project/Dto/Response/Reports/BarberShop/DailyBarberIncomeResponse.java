package com.barber.project.Dto.Response.Reports.BarberShop;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DailyBarberIncomeResponse {
    LocalDate date;
    private List<DailyIncomeItem> barbers;
}

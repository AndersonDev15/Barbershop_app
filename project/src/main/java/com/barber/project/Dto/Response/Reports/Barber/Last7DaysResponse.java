package com.barber.project.Dto.Response.Reports.Barber;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Last7DaysResponse {
    private List<DayIncomeResponse> days;
}

package com.barber.project.barber.dto.response.report;

import lombok.Builder;
import lombok.Data;

import java.util.List;


public record Last7DaysResponse(
         List<DayIncomeResponse> days
) { }

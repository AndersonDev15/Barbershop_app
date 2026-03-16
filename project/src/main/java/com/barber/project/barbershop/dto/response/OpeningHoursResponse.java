package com.barber.project.barbershop.dto.response;

import lombok.Builder;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Builder
public record OpeningHoursResponse(
         Long id,
         DayOfWeek dayOfWeek,
         LocalTime startTime,
         LocalTime endTime
) {


}

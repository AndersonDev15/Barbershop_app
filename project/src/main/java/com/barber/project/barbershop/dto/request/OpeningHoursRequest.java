package com.barber.project.barbershop.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.DayOfWeek;

public record OpeningHoursRequest(
        @Schema(
                description = "Día de la semana",
                examples = {"MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"},
                required = true
        )
         DayOfWeek dayOfWeek,

        @Schema(
                description = "Hora de apertura en formato HH:mm",
                example = "09:00",
                required = true
        )
         String startTime,

        @Schema(
                description = "Hora de cierre en formato HH:mm",
                example = "18:00",
                required = true
        )
         String endTime
) { }


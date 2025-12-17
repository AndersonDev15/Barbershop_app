package com.barber.project.Dto.Request.BarberShop;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.DayOfWeek;

@Data
public class OpeningHoursRequest {

    @Schema(
            description = "Día de la semana",
            examples = {"MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"},
            required = true
    )
    private DayOfWeek dayOfWeek;

    @Schema(
            description = "Hora de apertura en formato HH:mm",
            example = "09:00",
            required = true
    )
    private String startTime;

    @Schema(
            description = "Hora de cierre en formato HH:mm",
            example = "18:00",
            required = true
    )
    private String endTime;
}


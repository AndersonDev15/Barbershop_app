package com.barber.project.Dto.Request.Barber;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
@NoArgsConstructor
public class BarberBreakRequest {
    @Schema(description = "Hora de inicio del descanso", example = "14:00")
    private LocalTime start;

    @Schema(description = "Hora de fin del descanso", example = "15:00")
    private LocalTime end;

    @Schema(description = "Fecha del descanso", example = "2025-01-10")
    private LocalDate date;
}

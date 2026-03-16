package com.barber.project.barber.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record BarberBreakRequest(
        @Schema(description = "Hora de inicio del descanso", example = "14:00")
        @NotNull(message = "La fecha es obligatoria")
        LocalTime start,

        @Schema(description = "Hora de fin del descanso", example = "15:00")
        @NotNull(message = "La hora de inicio es obligatoria")
        LocalTime end,

        @Schema(description = "Fecha del descanso", example = "2025-01-10")
        @NotNull(message = "La hora de fin es obligatoria")
        LocalDate date

) { }

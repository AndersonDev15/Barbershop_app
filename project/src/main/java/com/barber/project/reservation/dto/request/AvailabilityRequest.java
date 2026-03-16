package com.barber.project.reservation.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;


public record AvailabilityRequest(
        @Schema(
                description = "ID del barbero al que se desea consultar la disponibilidad.",
                example = "12"
        )
        @NotNull
        Long barberId,

        @Schema(
                description = "Listado de IDs de subcategorías de servicio que el cliente está solicitando.",
                example = "[3, 5, 7]"
        )
        @NotEmpty
        List<Long> subcategoryIds,

        @Schema(
                description = "Fecha para la cual se va a consultar la disponibilidad.",
                example = "2025-03-15"
        )
        @NotNull
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate date
) { }

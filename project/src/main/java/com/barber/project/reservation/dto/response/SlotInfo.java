package com.barber.project.reservation.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalTime;

@Schema(
        name = "SlotInfo",
        description = "Representa un bloque horario disponible o no disponible para reservas."
)
public record SlotInfo(

        @Schema(
                description = "Hora del bloque disponible.",
                example = "14:00"
        )
        LocalTime time,

        @Schema(
                description = "Estado del bloque. Ejemplos: DISPONIBLE, NO DISPONIBLE, OCUPADO.",
                example = "DISPONIBLE"
        )
        String status

) {}

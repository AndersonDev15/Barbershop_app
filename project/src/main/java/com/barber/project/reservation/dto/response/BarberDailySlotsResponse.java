package com.barber.project.reservation.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

@Schema(
        name = "BarberDailySlotsResponse",
        description = "Respuesta con los bloques horarios (slots) del barbero para un día específico."
)
public record BarberDailySlotsResponse(

        @Schema(
                description = "ID del barbero.",
                example = "7"
        )
        Long barberId,

        @Schema(
                description = "Nombre completo del barbero.",
                example = "Carlos Mendoza"
        )
        String barberName,

        @Schema(
                description = "Fecha consultada.",
                example = "2025-03-15"
        )
        LocalDate date,

        @Schema(
                description = "Lista completa de bloques horarios del día, indicando si están disponibles, ocupados o bloqueados.",
                example = "[{ \"time\": \"09:00\", \"status\": \"DISPONIBLE\" }]"
        )
        List<SlotInfo> allSlots

) {}
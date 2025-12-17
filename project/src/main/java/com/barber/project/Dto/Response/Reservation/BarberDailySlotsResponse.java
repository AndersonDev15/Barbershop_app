package com.barber.project.Dto.Response.Reservation;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor

@Schema(
        name = "BarberDailySlotsResponse",
        description = "Respuesta con los bloques horarios (slots) del barbero para un día específico."
)
public class BarberDailySlotsResponse {

    @Schema(
            description = "ID del barbero.",
            example = "7"
    )
    private Long barberId;

    @Schema(
            description = "Nombre completo del barbero.",
            example = "Carlos Mendoza"
    )
    private String barberName;

    @Schema(
            description = "Fecha consultada.",
            example = "2025-03-15"
    )
    private LocalDate date;

    @Schema(
            description = "Lista completa de bloques horarios del día, indicando si están disponibles, ocupados o bloqueados.",
            example = "[{ \"time\": \"09:00\", \"status\": \"DISPONIBLE\" }]"
    )
    private List<SlotInfo> allSlots;
}
package com.barber.project.reservation.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Schema(
        name = "AvailabilityResponse",
        description = "Respuesta con la disponibilidad del barbero para una fecha específica."
)
public record AvailabilityResponse(

        @Schema(description = "ID del barbero.", example = "12")
        Long barberId,

        @Schema(description = "Nombre completo del barbero.", example = "Juan Pérez")
        String barber,

        @Schema(description = "Fecha consultada para la disponibilidad.", example = "2025-03-15")
        LocalDate date,

        @Schema(
                description = "Servicios seleccionados por el cliente para calcular duración, bloques y precio total."
        )
        List<ServiceInfo> selectedServices,

        @Schema(
                description = "Duración total (en minutos) de todos los servicios seleccionados.",
                example = "90"
        )
        int totalDuration,

        @Schema(
                description = "Cantidad de bloques necesarios según la duración total.",
                example = "3"
        )
        int requiredBlocks,

        @Schema(
                description = "Precio total calculado de todos los servicios seleccionados.",
                example = "45000.00"
        )
        BigDecimal totalPrice,

        @Schema(
                description = "Lista de horarios disponibles (bloques libres) donde el barbero puede atender al cliente."
        )
        List<SlotInfo> slots

) {}
package com.barber.project.Dto.Response.Reservation;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Schema(name = "AvailabilityResponse", description = "Respuesta con la disponibilidad del barbero para una fecha específica.")
public class AvailabilityResponse {

    @Schema(description = "ID del barbero.", example = "12")
    private Long barberId;

    @Schema(description = "Nombre completo del barbero.", example = "Juan Pérez")
    private String barber;

    @Schema(description = "Fecha consultada para la disponibilidad.", example = "2025-03-15")
    private LocalDate date;

    @Schema(
            description = "Servicios seleccionados por el cliente para calcular duración, bloques y precio total."
    )
    private List<ServiceInfo> selectedServices;

    @Schema(
            description = "Duración total (en minutos) de todos los servicios seleccionados.",
            example = "90"
    )
    private int totalDuration;

    @Schema(
            description = "Cantidad de bloques necesarios según la duración total.",
            example = "3"
    )
    private int requiredBlocks;

    @Schema(
            description = "Precio total calculado de todos los servicios seleccionados.",
            example = "45000.00"
    )
    private BigDecimal totalPrice;

    @Schema(
            description = "Lista de horarios disponibles (bloques libres) donde el barbero puede atender al cliente."
    )
    private List<SlotInfo> slots;
}

package com.barber.project.reservation.dto.response;

import com.barber.project.reservation.entity.enums.ReservationStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Schema(description = "Respuesta detallada de una reserva")
public record ReservationResponse(

        @Schema(description = "ID de la reserva", example = "120")
        Long id,

        @Schema(description = "Nombre del barbero asignado", example = "Carlos Díaz")
        String barber,

        @Schema(description = "Nombre del cliente", example = "Anderson Morales")
        String client,

        @Schema(description = "Lista de servicios incluidos en la reserva")
        List<ServiceInfo> services,

        @Schema(description = "Fecha de la reserva", example = "2025-01-15")
        LocalDate date,

        @Schema(description = "Hora de inicio", example = "14:30")
        LocalTime startTime,

        @Schema(description = "Hora de finalización", example = "15:10")
        LocalTime endTime,

        @Schema(description = "Precio total de los servicios", example = "45000.00")
        BigDecimal totalPrice,

        @Schema(description = "Estado actual de la reserva", example = "CONFIRMADA")
        ReservationStatus status

) {}
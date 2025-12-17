package com.barber.project.Dto.Response.Reservation;

import com.barber.project.Entity.enums.ReservationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "Respuesta detallada de una reserva")
public class ReservationResponse {

    @Schema(description = "ID de la reserva", example = "120")
    private Long id;

    @Schema(description = "Nombre del barbero asignado", example = "Carlos Díaz")
    private String barber;

    @Schema(description = "Nombre del cliente", example = "Anderson Morales")
    private String client;

    @Schema(description = "Lista de servicios incluidos en la reserva")
    private List<ServiceInfo> services;

    @Schema(description = "Fecha de la reserva", example = "2025-01-15")
    private LocalDate date;

    @Schema(description = "Hora de inicio", example = "14:30")
    private LocalTime startTime;

    @Schema(description = "Hora de finalización", example = "15:10")
    private LocalTime endTime;

    @Schema(description = "Precio total de los servicios", example = "45000.00")
    private BigDecimal totalPrice;

    @Schema(description = "Estado actual de la reserva", example = "CONFIRMADA")
    private ReservationStatus status;


}

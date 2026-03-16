package com.barber.project.reservation.dto.request;

import com.barber.project.reservation.entity.enums.ReservationStatus;
import io.swagger.v3.oas.annotations.media.Schema;


@Schema(description = "Solicitud para cambiar el estado de una reserva")
public record ChangeStatusRequest (
        @Schema(description = "Nuevo estado de la reserva",
                example = "EN_CURSO")
         ReservationStatus status
) { }


package com.barber.project.Dto.Request.Reservation;

import com.barber.project.Entity.enums.ReservationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para cambiar el estado de una reserva")
public class ChangeStatusRequest {

    @Schema(description = "Nuevo estado de la reserva",
            example = "EN_CURSO")
    private ReservationStatus status;
}


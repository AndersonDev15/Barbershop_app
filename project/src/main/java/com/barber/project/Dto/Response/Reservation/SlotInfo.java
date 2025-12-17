package com.barber.project.Dto.Response.Reservation;

import com.barber.project.Entity.enums.SlotStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
@Schema(name = "SlotInfo", description = "Representa un bloque horario disponible o no disponible para reservas.")
public class SlotInfo {

    @Schema(
            description = "Hora del bloque disponible.",
            example = "14:00"
    )
    private LocalTime time;

    @Schema(
            description = "Estado del bloque. Ejemplos: DISPONIBLE, NO DISPONIBLE, OCUPADO.",
            example = "DISPONIBLE"
    )
    private String status;
}


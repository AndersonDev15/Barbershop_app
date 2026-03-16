package com.barber.project.reservation.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.math.BigDecimal;


@Schema(
        name = "ServiceInfo",
        description = "Información de un servicio seleccionado por el cliente para calcular duración, precio y disponibilidad."
)
@Builder
public record ServiceInfo(

        @Schema(description = "ID del servicio.", example = "5")
        Long id,

        @Schema(description = "Nombre del servicio.", example = "Corte de cabello")
        String name,

        @Schema(
                description = "Duración del servicio en minutos.",
                example = "30"
        )
        int duration,

        @Schema(
                description = "Precio del servicio.",
                example = "15000.00"
        )
        BigDecimal price

) {}
package com.barber.project.Dto.Response.Reservation;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@Schema(
        name = "ServiceInfo",
        description = "Información de un servicio seleccionado por el cliente para calcular duración, precio y disponibilidad."
)
public class ServiceInfo {

    @Schema(description = "ID del servicio.", example = "5")
    private Long id;

    @Schema(description = "Nombre del servicio.", example = "Corte de cabello")
    private String name;

    @Schema(
            description = "Duración del servicio en minutos.",
            example = "30"
    )
    private int duration;

    @Schema(
            description = "Precio del servicio.",
            example = "15000.00"
    )
    private BigDecimal price;
}
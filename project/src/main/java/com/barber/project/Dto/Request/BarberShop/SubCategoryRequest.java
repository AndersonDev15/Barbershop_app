package com.barber.project.Dto.Request.BarberShop;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@Schema(description = "Datos necesarios para crear o actualizar una subcategoría asociada a un servicio")
public class SubCategoryRequest {

    @Schema(
            description = "Nombre de la subcategoría",
            example = "Corte degradado"
    )
    private String name;

    @Schema(
            description = "Descripción breve de la subcategoría",
            example = "Degradado bajo, medio o alto según preferencia del cliente."
    )
    private String description;

    @Schema(
            description = "Duración estimada del servicio en minutos",
            example = "45"
    )
    private Integer duration;

    @Schema(
            description = "Precio del servicio",
            example = "15000"
    )
    private BigDecimal price;
}

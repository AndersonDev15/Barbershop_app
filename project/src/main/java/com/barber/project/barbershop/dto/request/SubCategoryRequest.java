package com.barber.project.barbershop.dto.request;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos necesarios para crear o actualizar una subcategoría asociada a un servicio")
public record SubCategoryRequest(

        @Schema(
                description = "Nombre de la subcategoría",
                example = "Corte degradado"
        )
        String name,

        @Schema(
                description = "Descripción breve de la subcategoría",
                example = "Degradado bajo, medio o alto según preferencia del cliente."
        )
        String description,

        @Schema(
                description = "Duración estimada del servicio en minutos",
                example = "45"
        )
        Integer duration,

        @Schema(
                description = "Precio del servicio",
                example = "15000"
        )
        BigDecimal price

) {}
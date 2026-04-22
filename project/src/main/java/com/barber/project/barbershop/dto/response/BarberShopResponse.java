package com.barber.project.barbershop.dto.response;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;


@Schema(name = "BarberShopResponse", description = "Respuesta con información de una barbería")
public record BarberShopResponse (
        @Schema(description = "ID único de la barbería", example = "3")
         Long id,

        @Schema(description = "Nombre de la barbería", example = "Barbería Elegante")
         String name,

        @Schema(description = "Departamento donde se encuentra la barbería", example = "Cundinamarca")
        String department,
        @Schema(description = "Ciudad donde se encuentra la barbería", example = "Bogotá")
        String city,
        @Schema(description = "Dirección completa", example = "Calle 123 #45-67, Bogotá")
        String address,

        @Schema(description = "Teléfono de contacto", example = "3001234567")
         String phone,

        @Schema(description = "Indica si la barbería está abierta en este momento", example = "true")
         boolean openNow,

        @Schema(
                description = "Horarios de hoy",
                example = "[\"09:00 - 12:00\", \"14:00 - 19:00\"]"
        )
         List<String> todaySchedules,

        String coverImageUrl
) { }

package com.barber.project.Dto.Response.BarberShop;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Schema(name = "BarberShopResponse", description = "Respuesta con información de una barbería")
public class BarberShopResponse {
    @Schema(description = "ID único de la barbería", example = "3")
    private Long id;

    @Schema(description = "Nombre de la barbería", example = "Barbería Elegante")
    private String name;

    @Schema(description = "Dirección completa", example = "Calle 123 #45-67, Bogotá")
    private String address;

    @Schema(description = "Teléfono de contacto", example = "3001234567")
    private String phone;

    @Schema(description = "Indica si la barbería está abierta en este momento", example = "true")
    private boolean openNow;

    @Schema(
            description = "Horarios de hoy",
            example = "[\"09:00 - 12:00\", \"14:00 - 19:00\"]"
    )
    private List<String> todaySchedules;

}

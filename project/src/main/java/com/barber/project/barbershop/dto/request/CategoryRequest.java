package com.barber.project.barbershop.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank(message = "El nombre del servicio es requerido")
        String name,

        @NotBlank(message = "La descripcion es requerida")
        String description
) {}

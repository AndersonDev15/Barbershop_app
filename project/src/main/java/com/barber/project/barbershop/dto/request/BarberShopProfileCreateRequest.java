package com.barber.project.barbershop.dto.request;

import jakarta.validation.constraints.NotBlank;

public record BarberShopProfileCreateRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String barberShopName,
        @NotBlank(message = "El departamento es obligatorio")
         String department,
        @NotBlank(message = "La ciudad es obligatoria")
        String city,
        @NotBlank(message = "La dirección es obligatoria")
        String address,
        @NotBlank(message = "El teléfono es obligatorio")
        String phone
) {}
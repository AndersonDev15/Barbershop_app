package com.barber.project.barbershop.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateBarberInvitationRequest(
        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "El número de documento es obligatorio")
        String documentNumber,

        @NotNull(message = "La comisión es obligatoria")
        @DecimalMin(value = "0.0", message = "La comisión no puede ser menor que 0")
        @DecimalMax(value = "1.0", message = "La comisión no puede ser mayor que 1")
        BigDecimal commission
) {}



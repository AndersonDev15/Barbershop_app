package com.barber.project.barbershop.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;


import java.math.BigDecimal;


public record UpdateBarberCommissionRequest(
        @Schema(description = "Nueva comisión del barbero", example = "0.35")
        @NotNull(message = "La nueva comisión es obligatoria")
        @DecimalMin(value = "0.0", message = "La comisión no puede ser negativa")
        @DecimalMax(value = "100.0", message = "La comisión no puede ser mayor a 100%")
         BigDecimal newCommission
) { }

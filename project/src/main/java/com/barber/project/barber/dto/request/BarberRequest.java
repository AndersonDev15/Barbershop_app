package com.barber.project.barber.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Schema(description = "Datos necesarios para registrar un barbero en la barbería")
public record BarberRequest(

        @Schema(
                description = "Número de documento del barbero",
                example = "1020304050"
        )
        @NotBlank(message = "El número de documento es requerido")
        String documentNumber,

        @Schema(
                description = "Comisión del barbero (valor entre 0 y 1, donde 1 = 100%)",
                example = "0.30"
        )
        @NotNull(message = "La comisión es requerida")
        @DecimalMin(value = "0.0", message = "La comisión no puede ser negativa")
        @DecimalMax(value = "1.0", message = "La comisión no puede ser mayor a 100%")
        BigDecimal commission

) {}

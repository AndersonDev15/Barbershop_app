package com.barber.project.Dto.Request.BarberShop;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateBarberCommissionRequest {

    @Schema(description = "Nueva comisión del barbero", example = "0.35")
    @NotNull(message = "La nueva comisión es obligatoria")
    @DecimalMin(value = "0.0", message = "La comisión no puede ser negativa")
    @DecimalMax(value = "100.0", message = "La comisión no puede ser mayor a 100%")
    private BigDecimal newCommission;
}

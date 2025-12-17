package com.barber.project.Dto.Request.BarberShop;

import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class BarberRequest {
    @Schema(description = "Número de documento", example = "12345678")
    private String documentNumber;
    @Schema(description = "Comisión del barbero", example = "30.5")
    private BigDecimal commission;

}

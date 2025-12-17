package com.barber.project.Dto.Request.BarberShop;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddBarberRequest {
    @Schema(description = "Correo del barbero que se va a vincular", example = "barbero@correo.com")
    @NotBlank(message = "El email es obligatorio")
    private String email;

    @Schema(description = "Datos adicionales del barbero")
    private BarberRequest barberRequest;
}

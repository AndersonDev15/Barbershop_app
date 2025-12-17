package com.barber.project.Dto.Request.Authentication;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(description = "Request para validar la contraseña actual antes de enviar el código de verificación")
@Data
public class ValidatePasswordRequest {

    @Schema(
            description = "Contraseña actual del usuario",
            example = "MiClaveActual123"
    )
    @NotBlank(message = "La contraseña actual es obligatoria")
    private String currentPassword;
}
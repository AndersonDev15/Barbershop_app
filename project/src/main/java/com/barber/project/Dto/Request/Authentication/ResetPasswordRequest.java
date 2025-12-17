package com.barber.project.Dto.Request.Authentication;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(description = "Request para cambiar la contraseña usando un código de verificación")
@Data
public class ResetPasswordRequest {

    @Schema(
            description = "Código enviado al correo del usuario",
            example = "482915"
    )
    @NotBlank(message = "El código es obligatorio")
    private String code;

    @Schema(
            description = "Nueva contraseña del usuario",
            example = "NewPassword123*"
    )
    @NotBlank(message = "La nueva contraseña es obligatoria")
    private String newPassword;

    @Schema(
            description = "Confirmación de la nueva contraseña",
            example = "NewPassword123*"
    )
    @NotBlank(message = "Debes repetir la contraseña")
    private String confirmPassword;
}

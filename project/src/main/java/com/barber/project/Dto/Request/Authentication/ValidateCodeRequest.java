package com.barber.project.Dto.Request.Authentication;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(description = "Request para validar el código enviado al correo del usuario")
@Data
public class ValidateCodeRequest {

    @Schema(
            description = "Código de verificación enviado por correo",
            example = "482915"
    )
    @NotBlank(message = "El código es obligatorio")
    private String code;
}

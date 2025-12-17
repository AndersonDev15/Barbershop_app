package com.barber.project.Dto.Request.Authentication;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginRequest {
    @Schema(
            description = "Correo electrónico del usuario",
            example = "usuario@correo.com"
    )
    private String email;

    @Schema(
            description = "Contraseña del usuario",
            example = "123456"
    )
    private String password;
}

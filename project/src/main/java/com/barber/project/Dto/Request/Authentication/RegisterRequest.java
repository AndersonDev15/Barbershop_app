package com.barber.project.Dto.Request.Authentication;

import com.barber.project.Dto.Request.BarberShop.BarberShopRequest;
import com.barber.project.Entity.enums.UserType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(description = "Solicitud para registrar un nuevo usuario")
public class RegisterRequest {

    @Schema(
            description = "Correo electrónico del usuario",
            example = "cliente@correo.com"
    )
    @NotBlank @Email
    private String email;

    @Schema(
            description = "Contraseña del usuario",
            example = "123456"
    )
    @NotBlank @Size(min = 6, max = 20)
    private String password;

    @Schema(description = "Nombre del usuario", example = "Carlos")
    @NotBlank
    private String firstName;

    @Schema(description = "Apellido del usuario", example = "Ramírez")
    @NotBlank
    private String lastName;

    @Schema(
            description = "Número telefónico (10 dígitos)",
            example = "3001234567"
    )
    @NotBlank @Pattern(regexp = "^[0-9]{10}$")
    private String phone;

    @Schema(
            description = "Tipo de usuario a registrar",
            example = "CLIENTE"
    )
    @NotNull
    private UserType userType;

    @Schema(
            description = "Datos de la barbería (solo obligatorio si userType = BARBERIA)"
    )
    private BarberShopRequest barberShop;
}

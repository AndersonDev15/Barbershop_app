package com.barber.project.Controller.Auth;

import com.barber.project.Dto.Request.Authentication.*;
import com.barber.project.Service.Barber.BarberProfileService;
import com.barber.project.Service.BarberShop.BarberShopProfileService;
import com.barber.project.Service.Clients.ClientProfileService;
import com.barber.project.Service.Auth.ForgotPasswordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Password Reset")
@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
public class PasswordResetController {
    private final ClientProfileService clientProfileService;
    private final BarberProfileService barberProfileService;
    private final BarberShopProfileService barberShopProfileService;
    private final ForgotPasswordService forgotPasswordService;

    //contraseña

    // validar contraseña y enviar código
    @Operation(summary = "Validar contraseña actual y enviar código de verificación",
            description = "Valida que la contraseña actual coincide y envía un código al correo del usuario para poder cambiar la contraseña.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Código enviado al correo"),
            @ApiResponse(responseCode = "400", description = "Contraseña inválida", content = @Content),
            @ApiResponse(responseCode = "401", description = "El usuario debe estar autenticado", content = @Content)
    })
    @PostMapping("/validate")
    public ResponseEntity<String> validatePasswordAndSendCode(@Valid @RequestBody ValidatePasswordRequest request){
        forgotPasswordService.validatePasswordAndSendCode(request.getCurrentPassword());
        return ResponseEntity.ok("Código enviado al correo");
    }

    //validar codigo
    @Operation(
            summary = "Validar código enviado al correo",
            description = "Verifica que el código ingresado coincide con el enviado al usuario."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Código válido"),
            @ApiResponse(responseCode = "400", description = "Código inválido", content = @Content),
    })
    @PostMapping("/validate-code")
    public ResponseEntity<String> ValidateCode(@Valid @RequestBody ValidateCodeRequest request) {
        forgotPasswordService.validateCode(request.getCode());
        return ResponseEntity.ok("Codigo valido");
    }

    //reestablecer contraseña

    @Operation(
            summary = "Cambiar contraseña usando código de verificación",
            description = "El usuario cambia su contraseña usando el código enviado previamente."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contraseña actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "Código inválido o las contraseñas no coinciden", content = @Content),
    })
    @PutMapping("/reset")
    public ResponseEntity<String> ResetPassword(@Valid @RequestBody ResetPasswordRequest request){

        if(!request.getNewPassword().equals(request.getConfirmPassword())){
            throw new ValidationException("Las contraseñas no coinciden");
        }


        forgotPasswordService.ResetPassword(
                request.getCode(),
                request.getNewPassword()
        );
        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }

}

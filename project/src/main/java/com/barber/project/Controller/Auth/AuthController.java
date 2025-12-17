package com.barber.project.Controller.Auth;

import com.barber.project.Dto.Request.Authentication.LoginRequest;
import com.barber.project.Dto.Request.Authentication.RegisterRequest;
import com.barber.project.Service.Auth.AuthService;
import com.barber.project.Dto.Response.Auth.tokenResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth")
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Registrar un usuario",
            description = """
                    Permite registrar un usuario según su tipo:
                    - CLIENTE: crea el usuario básico.
                    - BARBERIA: crea el usuario y también los datos de la barbería.
                    - BARBERO: el barbero crea su cuenta de manera independiente.
                    
                    Si el usuario a registrar es CLIENTE o BARBERO no es necesario colocar:
                    "barbershop": {}
                    """)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request){
        String message = authService.register(request);
        return ResponseEntity.ok(message);
    }


    @Operation(
            summary = "Iniciar sesión",
            description = "Devuelve un token JWT para acceder a los endpoints protegidos."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inicio de sesión exitoso"),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<tokenResponse>login(@RequestBody LoginRequest request){
        tokenResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}

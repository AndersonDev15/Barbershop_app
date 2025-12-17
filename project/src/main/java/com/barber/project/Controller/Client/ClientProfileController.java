package com.barber.project.Controller.Client;

import com.barber.project.Dto.Request.Client.ClientProfileUpdateRequest;
import com.barber.project.Dto.Response.Auth.ClientProfileResponse;
import com.barber.project.Service.Clients.ClientProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Perfil - Cliente")
@RestController
@RequestMapping("/api/client/profile")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
public class ClientProfileController {

    private final ClientProfileService service;

    @Operation(
            summary = "Obtener perfil del cliente",
            description = "Devuelve la información del cliente autenticado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado - El usuario no tiene rol CLIENTE")
    })
    @GetMapping
    public ClientProfileResponse getProfile() {
        return service.getProfile();
    }

    @Operation(
            summary = "Actualizar perfil del cliente",
            description = "Permite al cliente modificar su información personal."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @PutMapping
    public ClientProfileResponse updateProfile(
            @Valid @RequestBody ClientProfileUpdateRequest request) {
        return service.UpdateProfile(request);
    }
}

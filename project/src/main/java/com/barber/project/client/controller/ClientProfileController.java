package com.barber.project.client.controller;

import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.client.dto.response.ClientProfileResponse;
import com.barber.project.client.service.ClientProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/client")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
@Tag(name = "Perfil - Cliente")
public class ClientProfileController {
    private final ClientProfileService clientProfileService;

    @Operation(summary = "Inicializar cliente", description = "Crea el cliente si no existe. Llamar una vez después del primer login.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cliente inicializado correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @PostMapping("/init")
    public ResponseEntity<ClientProfileResponse> init(
            @AuthenticationPrincipal CurrentUser currentUser) {
        clientProfileService.createClient(currentUser.userUuid());
        return ResponseEntity.ok(clientProfileService.getProfile(currentUser.userUuid()));
    }

    @Operation(summary = "Obtener perfil del cliente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @GetMapping("/profile")
    public ResponseEntity<ClientProfileResponse> getProfile(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(clientProfileService.getProfile(currentUser.userUuid()));
    }
}

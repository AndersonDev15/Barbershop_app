package com.barber.project.barber.controller;


import com.barber.project.barber.dto.response.BarberProfileResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barber.service.BarberProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Perfil - Barbero")
@RestController
@RequestMapping("/api/barber/profile")
@PreAuthorize("hasRole('BARBERO')")
@RequiredArgsConstructor
public class BarberProfileController {

    private final BarberProfileService service;

    @Operation(
            summary = "Obtener perfil del barbero",
            description = """
                    Retorna toda la información del perfil del barbero autenticado.
                    - Nota: Para obtener los datos del barbero, el barbero debe estar asociado a una barberia
                    """

    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado - El usuario no tiene rol BARBERO")
    })
    @GetMapping
    public BarberProfileResponse getProfile(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return service.getProfile(currentUser.userUuid());
    }




}


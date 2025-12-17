package com.barber.project.Controller.BarberShop;

import com.barber.project.Dto.Request.BarberShop.BarberShopProfileUpdateRequest;
import com.barber.project.Dto.Response.BarberShop.BarberShopProfileResponse;
import com.barber.project.Service.BarberShop.BarberShopProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Perfil - Barbería")
@RestController
@RequestMapping("/api/barbershop/profile")
@PreAuthorize("hasRole('BARBERIA')")
@RequiredArgsConstructor
public class BarberShopProfileController {

    private final BarberShopProfileService service;

    @Operation(
            summary = "Obtener perfil de la barbería",
            description = "Retorna la información completa del perfil de la barbería autenticada."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado - El usuario no tiene rol BARBERIA")
    })
    @GetMapping
    public BarberShopProfileResponse getProfile() {
        return service.getProfile();
    }


    @Operation(
            summary = "Actualizar perfil de la barbería",
            description = "Permite a la barbería modificar su información y datos comerciales."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @PutMapping
    public BarberShopProfileResponse updateProfile(
            @Valid @RequestBody BarberShopProfileUpdateRequest request) {
        return service.updateProfile(request);
    }
}

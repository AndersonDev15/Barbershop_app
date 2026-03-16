package com.barber.project.barbershop.controller;


import com.barber.project.barbershop.dto.request.BarberShopProfileCreateRequest;
import com.barber.project.barbershop.dto.request.BarberShopProfileUpdateRequest;
import com.barber.project.barbershop.dto.response.BarberShopExistsResponse;
import com.barber.project.barbershop.dto.response.BarberShopProfileResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barbershop.service.BarberShopProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Barbería - Perfil")
@RestController
@RequestMapping("/api/barbershop")
@PreAuthorize("hasRole('BARBERIA')")
@RequiredArgsConstructor
public class BarberShopProfileController {
    private final BarberShopProfileService service;

    @Operation(summary = "Crear barbería")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Barbería creada correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "401", description = "No autenticado.")
    })
    @PostMapping
    public ResponseEntity<BarberShopProfileResponse> createBarberShop(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody BarberShopProfileCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createProfile(currentUser.userUuid(), request));
    }

    @Operation(summary = "Verificar si existe la barbería")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Verificación obtenida correctamente."),
            @ApiResponse(responseCode = "401", description = "No autenticado.")
    })
    @GetMapping("/my/exists")
    public ResponseEntity<BarberShopExistsResponse> myBarberShopExists(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(service.getMyBarberShop(currentUser.userUuid()));
    }

    @Operation(summary = "Obtener mi barbería")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Barbería obtenida correctamente."),
            @ApiResponse(responseCode = "404", description = "Barbería no encontrada."),
            @ApiResponse(responseCode = "401", description = "No autenticado.")
    })
    @GetMapping("/my")
    public ResponseEntity<BarberShopProfileResponse> getMyBarberShop(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(service.getProfile(currentUser.userUuid()));
    }

    @Operation(summary = "Actualizar perfil de la barbería")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil actualizado correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "401", description = "No autenticado.")
    })
    @PutMapping
    public ResponseEntity<BarberShopProfileResponse> updateProfile(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody BarberShopProfileUpdateRequest request) {
        return ResponseEntity.ok(service.updateProfile(currentUser.userUuid(), request));
    }
}
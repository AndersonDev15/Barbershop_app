package com.barber.project.barbershop.controller;

import com.barber.project.barber.dto.request.BarberRequest;
import com.barber.project.barber.dto.response.BarberResponse;
import com.barber.project.barbershop.dto.request.UpdateBarberCommissionRequest;
import com.barber.project.barbershop.dto.response.UpdateBarberResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barbershop.service.ManageBarberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Barbería - Gestión de Barberos")
@RestController
@RequestMapping("/api/barbershop")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BARBERIA')")
public class ManageBarberController {
    private final ManageBarberService manageBarberService;

    @Operation(summary = "Listar barberos de la barbería")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente.")
    @GetMapping("/barbers")
    public ResponseEntity<List<BarberResponse>> myBarbers(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(manageBarberService.getBarber(currentUser.userUuid()));
    }

    @Operation(summary = "Actualizar comisión de un barbero")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comisión actualizada correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "404", description = "Barbero no encontrado.")
    })
    @PatchMapping("/{barberId}/commission")
    public ResponseEntity<UpdateBarberResponse> updateCommission(
            @PathVariable Long barberId,
            @Valid @RequestBody UpdateBarberCommissionRequest request,
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(manageBarberService.updateBarberCommission(
                barberId, request.newCommission(), currentUser.userUuid()));
    }

    @Operation(summary = "Desactivar barbero")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Barbero desactivado correctamente."),
            @ApiResponse(responseCode = "404", description = "Barbero no encontrado.")
    })
    @PatchMapping("/{barberId}/desactivate")
    public ResponseEntity<Void> desactivateBarber(
            @PathVariable Long barberId,
            @AuthenticationPrincipal CurrentUser currentUser) {
        manageBarberService.deactivateBarber(barberId, currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Activar barbero")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Barbero activado correctamente."),
            @ApiResponse(responseCode = "404", description = "Barbero no encontrado.")
    })
    @PatchMapping("/{barberId}/activate")
    public ResponseEntity<Void> activateBarber(
            @PathVariable Long barberId,
            @AuthenticationPrincipal CurrentUser currentUser) {
        manageBarberService.activateBarber(barberId, currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Poner barbero en vacaciones")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Barbero en vacaciones correctamente."),
            @ApiResponse(responseCode = "404", description = "Barbero no encontrado.")
    })
    @PatchMapping("/{barberId}/vacation")
    public ResponseEntity<Void> vacationBarber(
            @PathVariable Long barberId,
            @AuthenticationPrincipal CurrentUser currentUser) {
        manageBarberService.setBarberOnVacation(barberId, currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }
}
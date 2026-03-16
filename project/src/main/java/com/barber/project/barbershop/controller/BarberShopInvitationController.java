package com.barber.project.barbershop.controller;

import com.barber.project.barbershop.dto.request.CreateBarberInvitationRequest;
import com.barber.project.barbershop.dto.response.BarberInvitationResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barbershop.service.BarberInvitationService;
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

import java.util.List;

@Tag(name = "Barbería - Invitaciones")
@RestController
@RequestMapping("/api/barbershop/invitations")
@PreAuthorize("hasRole('BARBERIA')")
@RequiredArgsConstructor
public class BarberShopInvitationController {
    private final BarberInvitationService barberInvitationService;

    @Operation(summary = "Crear invitación para barbero")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Invitación creada correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos.")
    })
    @PostMapping
    public ResponseEntity<BarberInvitationResponse> createInvitation(
            @Valid @RequestBody CreateBarberInvitationRequest request,
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(barberInvitationService.barberInvitation(currentUser.userUuid(), request));
    }

    @Operation(summary = "Listar invitaciones de la barbería")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente.")
    @GetMapping
    public ResponseEntity<List<BarberInvitationResponse>> getInvitations(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(barberInvitationService.getInvitation(currentUser.userUuid()));
    }

    @Operation(summary = "Cancelar invitación")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Invitación cancelada correctamente."),
            @ApiResponse(responseCode = "404", description = "Invitación no encontrada.")
    })
    @DeleteMapping("/{token}")
    public ResponseEntity<Void> cancelInvitation(
            @PathVariable String token,
            @AuthenticationPrincipal CurrentUser currentUser) {
        barberInvitationService.cancelInvitation(currentUser.userUuid(), token);
        return ResponseEntity.noContent().build();
    }
}
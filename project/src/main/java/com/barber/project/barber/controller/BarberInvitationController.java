package com.barber.project.barber.controller;

import com.barber.project.barber.dto.request.BarberRequest;
import com.barber.project.barber.dto.response.InvitationDetailsResponse;
import com.barber.project.barbershop.dto.response.BarberInvitationResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barber.service.BarberInvitationResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Barbero - Invitaciones")
@RestController
@RequestMapping("/api/barber/invitations")
@PreAuthorize("hasRole('BARBERO')")
@RequiredArgsConstructor
public class BarberInvitationController {
    private final BarberInvitationResponseService responseService;

    @Operation(summary = "Listar invitaciones pendientes")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente.")
    @GetMapping("/pending")
    public ResponseEntity<List<BarberInvitationResponse>> pendingInvitation(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(responseService.getPendingInvitations(currentUser.email()));
    }

    @GetMapping("/{token}")
    public ResponseEntity<InvitationDetailsResponse> getInvitationDetails(
            @PathVariable String token
    ) {
        return ResponseEntity.ok(
                responseService.getInvitationDetails(token)
        );
    }

    @Operation(summary = "Aceptar invitación")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Invitación aceptada correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "404", description = "Invitación no encontrada.")
    })
    @PostMapping("/{token}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable String token,
            @AuthenticationPrincipal CurrentUser currentUser) {
        responseService.acceptInvitation(currentUser.userUuid(), currentUser.email(), token);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Rechazar invitación")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Invitación rechazada correctamente."),
            @ApiResponse(responseCode = "404", description = "Invitación no encontrada.")
    })
    @PostMapping("/{token}/reject")
    public ResponseEntity<Void> rejectInvitation(
            @PathVariable String token,
            @AuthenticationPrincipal CurrentUser currentUser) {
        responseService.rejectInvitation(currentUser.userUuid(), token);
        return ResponseEntity.noContent().build();
    }
}
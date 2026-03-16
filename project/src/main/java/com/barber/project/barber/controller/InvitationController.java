package com.barber.project.barber.controller;

import com.barber.project.barber.dto.response.InvitationDetailsResponse;
import com.barber.project.barber.service.BarberInvitationResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Barbero - Invitaciones")
@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class InvitationController {
    private final BarberInvitationResponseService responseService;

    @Operation(summary = "Obtener detalles de una invitación")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Invitación encontrada."),
            @ApiResponse(responseCode = "404", description = "Invitación no encontrada.")
    })
    @GetMapping("/{token}")
    public ResponseEntity<InvitationDetailsResponse> getInvitationDetails(
            @PathVariable String token) {
        return ResponseEntity.ok(responseService.getInvitationDetails(token));
    }
}

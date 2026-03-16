package com.barber.project.reservation.controller;


import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.reservation.dto.request.ReservationRequest;
import com.barber.project.reservation.dto.response.ReservationResponse;
import com.barber.project.reservation.entity.enums.ReservationStatus;
import com.barber.project.reservation.service.ReservationService;
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

@Tag(name="Cliente - Reservas")
@RestController
@RequestMapping("/api/client/reservations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CLIENTE')")
public class ClientReservationController {
    private final ReservationService reservationService;


    //crear reservacion
    @Operation(
            summary = "Crear una reserva",
            description = """
                    Permite que un cliente cree una reserva especificando servicios, barbero y horario.
                    - Enviar notificacion por correo electronico al barbero que tiene una nueva reserva
                    """

    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reserva creada con éxito."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody ReservationRequest request) {

        ReservationResponse response = reservationService.createReservation(request, currentUser.userUuid());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //obtener las reservas
    @Operation(
            summary = "Obtener mis reservas",
            description = "Devuelve todas las reservas del cliente, permitiendo filtrar por estado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal CurrentUser currentUser,
            @RequestParam(required = false) ReservationStatus status) {

        List<ReservationResponse> reservations = reservationService.getMyClientReservations(status, currentUser.userUuid());
        return ResponseEntity.ok(reservations);
    }

    //cancelar reservacion
    @Operation(
            summary = "Cancelar una reserva",
            description = """
                    Permite que el cliente cancele una de sus reservas.
                    - Enviar notificacion al barbero que se cancelo una cita
                    """

    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reserva cancelada correctamente."),
            @ApiResponse(responseCode = "400", description = "La reserva no puede cancelarse."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @PatchMapping("/{reservationId}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long reservationId) {

        ReservationResponse response = reservationService.cancelReservation(reservationId, currentUser.userUuid());
        return ResponseEntity.ok(response);
    }
}


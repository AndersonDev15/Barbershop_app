package com.barber.project.Controller.Barber;

import com.barber.project.Dto.Request.Reservation.ChangeStatusRequest;
import com.barber.project.Dto.Response.Reservation.ReservationResponse;
import com.barber.project.Service.Reservation.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Barbero - Reservas")
@RestController
@RequestMapping("/api/barber/reservation")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BARBERO')")
public class BarberReservationController {
    private final ReservationService reservationService;


    //reservas por dia
    @Operation(
            summary = "Reservas del día (por fecha)",
            description = "Devuelve las reservas del barbero para la fecha indicada."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @GetMapping("/daily")
    public ResponseEntity<List<ReservationResponse>> getDailyReservations(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<ReservationResponse> reservations = reservationService.listReservation(date);
        return ResponseEntity.ok(reservations);
    }

    //reservas de hoy
    @Operation(
            summary = "Reservas de hoy",
            description = "Obtiene todas las reservas del barbero correspondientes al día actual."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @GetMapping("/today")
    public ResponseEntity<List<ReservationResponse>> getTodayReservations() {

        List<ReservationResponse> reservations = reservationService.getMyTodayReservations();
        return ResponseEntity.ok(reservations);
    }

    //actualizar estado de reserva
    @Operation(
            summary = "Cambiar estado de una reserva",
            description = """
                     Permite que el barbero actualice el estado de una reserva (en progreso, completada, etc.).
                     - Se envia un correo electronico al cliente para notificarle que se actualizado el estado de la cita
                    """

    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado correctamente."),
            @ApiResponse(responseCode = "400", description = "Estado inválido."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @PatchMapping("/{reservationId}/status")
    @PreAuthorize("hasRole('BARBERO')")
    public ResponseEntity<ReservationResponse> changeStatus(
            @PathVariable Long reservationId,
            @Valid @RequestBody ChangeStatusRequest request) {

        ReservationResponse response =
                reservationService.changeReservationStatus(reservationId, request.getStatus());

        return ResponseEntity.ok(response);
    }

}

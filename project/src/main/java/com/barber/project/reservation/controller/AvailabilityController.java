package com.barber.project.reservation.controller;


import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.reservation.dto.request.AvailabilityRequest;
import com.barber.project.reservation.dto.response.AvailabilityResponse;
import com.barber.project.reservation.dto.response.BarberDailySlotsResponse;
import com.barber.project.reservation.service.AvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Tag(name = "Disponibilidad")
@RestController
@RequestMapping("/api")

@AllArgsConstructor
public class AvailabilityController {
    private final AvailabilityService availabilityService;

    @Operation(
            summary = "Buscar disponibilidad",
            description = "Devuelve los horarios disponibles para un barbero según los servicios solicitados y la fecha."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta realizada correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos en la solicitud."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @PostMapping("client/availability/search")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<AvailabilityResponse> availability(@Valid @RequestBody AvailabilityRequest request){
        AvailabilityResponse response = availabilityService.getAvailabilityForClient(request);
        return ResponseEntity.ok(response);
    }

    //barbero

    @Operation(summary = "Ver mi disponibilidad", description = "Devuelve los slots disponibles del barbero autenticado para una fecha.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta realizada correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @GetMapping("/barber/availability")
    @PreAuthorize("hasRole('BARBERO')")
    public ResponseEntity<BarberDailySlotsResponse> getBarberSelfAvailability(
            @AuthenticationPrincipal CurrentUser currentUser,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate localDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(availabilityService.getBarberSelfAvailability(currentUser.userUuid(), localDate));
    }


    // barberia
    //ver disponibilidad de un barbero
    @Operation(
            summary = "Consultar disponibilidad de un barbero",
            description = "Devuelve la disponibilidad diaria de un barbero específico. "
                    + "Si no se envía fecha, se usa la fecha actual."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Disponibilidad recuperada correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "401", description = "No autorizado."),
            @ApiResponse(responseCode = "403", description = "No tienes permisos para esta acción.")
    })
    @GetMapping("/barbershop/barber/{barberId}/availability")
    @PreAuthorize("hasRole('BARBERIA')")
    public ResponseEntity<BarberDailySlotsResponse> getBarberAvailability(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long barberId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDate localDate = (date==null) ? LocalDate.now() : date;
        BarberDailySlotsResponse response = availabilityService.getBarberAvailabilityForShop(barberId,localDate, currentUser.userUuid());

        return ResponseEntity.ok(response);
    }




}


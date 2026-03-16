package com.barber.project.barber.controller;


import com.barber.project.barber.dto.request.BarberBreakRequest;
import com.barber.project.barber.dto.response.BarberBreakResponse;
import com.barber.project.reservation.dto.response.BarberDailySlotsResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.reservation.service.AvailabilityService;
import com.barber.project.barber.service.BarberBreakService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Barbero - Disponibilidad y Descansos")
@RestController
@RequestMapping("/api/barber")
@PreAuthorize("hasRole('BARBERO')")
@RequiredArgsConstructor
public class BarberController {
    private final BarberBreakService barberBreakService;


    //crear breaks
    @Operation(
            summary = "Registrar un descanso",
            description = "Permite que el barbero registre un horario de descanso para una fecha específica."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "401", description = "No autorizado."),
            @ApiResponse(responseCode = "403", description = "No tienes rol de barbero.")
    })
    @PostMapping("/break")
    public ResponseEntity<BarberBreakResponse> createBreak(
            @RequestBody @Valid BarberBreakRequest request,
            @AuthenticationPrincipal CurrentUser currentUser){
        BarberBreakResponse response = barberBreakService.createBreak(request, currentUser.userUuid());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //litsar los breaks
    @Operation(
            summary = "Listar descansos",
            description = "Obtiene todos los descansos del barbero para una fecha específica."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de descansos devuelta correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @GetMapping("/break")
    public ResponseEntity<List<BarberBreakResponse>> listBreak(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal CurrentUser currentUser){
        List<BarberBreakResponse> responses = barberBreakService.listBreaks(date, currentUser.userUuid());
        return ResponseEntity.ok(responses);
    }


}


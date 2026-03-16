package com.barber.project.barbershop.controller;


import com.barber.project.reservation.dto.response.BarberDailySlotsResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.reservation.service.AvailabilityService;
import com.barber.project.barbershop.service.BarberShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Tag(name = "Barbería - Gestión de Barberos")
@RestController
@RequestMapping("/api/barbershop")
@PreAuthorize("hasRole('BARBERIA')")
@RequiredArgsConstructor
public class BarberShopController {
    private final BarberShopService barberShopService;
    private final AvailabilityService availabilityService;




    //barberia
    @Operation(summary = "Activar barbería")
    @PutMapping("/activate")
    public ResponseEntity<Void> activate(@AuthenticationPrincipal CurrentUser currentUser){
        barberShopService.activateBarberShop(currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }
    @Operation(summary = "Desactivar barbería")
    @PutMapping("/desactivate")
    public ResponseEntity<Void> desactivate(@AuthenticationPrincipal CurrentUser currentUser){
        barberShopService.desactivateBarberShop(currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }



}


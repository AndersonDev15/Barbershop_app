package com.barber.project.barber.controller.report;


import com.barber.project.barber.dto.response.report.BarberDashboardResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barber.service.report.BarberDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Barbero - Dashboard")
@RestController
@RequestMapping("/api/barber/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BARBERO')")
public class BarberDashboardController {
    private final BarberDashboardService barberDashboardService;


    @Operation(
            summary = "Obtener resumen general de los ingresos del barbero",
            description = "Devuelve estadísticas y métricas clave del panel principal del barbero."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Datos del dashboard obtenidos correctamente")
    })
    @GetMapping
    public ResponseEntity<BarberDashboardResponse> getDashboard(
            @AuthenticationPrincipal CurrentUser currentUser
            ) {
        return ResponseEntity.ok(barberDashboardService.dashboard(currentUser.userUuid()));
    }

}


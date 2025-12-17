package com.barber.project.Controller.Reports;

import com.barber.project.Dto.Response.Reports.BarberShop.BarbershopReportResponse;
import com.barber.project.Service.Report.BarberShopDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Barbería - Dashboard")
@RestController
@RequestMapping("/api/barbershop/dashboard")
@PreAuthorize("hasRole('BARBERIA')")
@RequiredArgsConstructor
public class BarberShopDashboardController {

    private final BarberShopDashboardService barberShopDashboardService;

    @Operation(
            summary = "Obtener resumen general de la barbería",
            description = "Devuelve estadísticas y métricas clave del panel principal de la barbería."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Datos del dashboard obtenidos correctamente")
    })
    @GetMapping
    public ResponseEntity<BarbershopReportResponse> getDashboard(){
        BarbershopReportResponse response = barberShopDashboardService.dashboard();
        return ResponseEntity.ok(response);
    }

}

package com.barber.project.Controller.Client;

import com.barber.project.Dto.Request.Barber.AvailabilityRequest;
import com.barber.project.Dto.Response.Reservation.AvailabilityResponse;
import com.barber.project.Service.Barber.AvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Cliente - Disponibilidad")
@RestController
@RequestMapping("/api/client/availability")
@PreAuthorize("hasRole('CLIENTE')")
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
    @PostMapping("/search")
    public ResponseEntity<AvailabilityResponse> availability(@Valid @RequestBody AvailabilityRequest request){
        AvailabilityResponse response = availabilityService.getAvailabilityResponse(request);
        return ResponseEntity.ok(response);
    }

}

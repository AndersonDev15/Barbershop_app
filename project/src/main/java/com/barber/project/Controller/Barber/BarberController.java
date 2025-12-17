package com.barber.project.Controller.Barber;

import com.barber.project.Dto.Request.Barber.BarberBreakRequest;
import com.barber.project.Dto.Response.Barber.BarberBreakResponse;
import com.barber.project.Dto.Response.Reservation.BarberDailySlotsResponse;
import com.barber.project.Entity.BarberBreak;
import com.barber.project.Service.Barber.AvailabilityService;
import com.barber.project.Service.Barber.BarberBreakService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final AvailabilityService availabilityService;

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
    public ResponseEntity<BarberBreakResponse> createBreak(@RequestBody BarberBreakRequest request){
        BarberBreakResponse response = barberBreakService.createBreak(request);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<List<BarberBreakResponse>> listBreak( @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        List<BarberBreakResponse> responses = barberBreakService.listBreaks(date);
        return ResponseEntity.ok(responses);
    }

    //ver disponibilidad
    @Operation(
            summary = "Consultar mi disponibilidad diaria",
            description = "Devuelve los bloques horarios del barbero autenticado para la fecha especificada. "
                    + "Si no se envía fecha, se usa la fecha actual."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Disponibilidad recuperada correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado."),
            @ApiResponse(responseCode = "403", description = "No tienes permisos.")
    })

    @GetMapping("/availability")
    public ResponseEntity<BarberDailySlotsResponse> getSelfAvailability(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDate localDate = (date==null) ? LocalDate.now() : date;

        return ResponseEntity.ok(availabilityService.getBarberSelfAvailability(localDate));
    }
}

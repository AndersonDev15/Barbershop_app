package com.barber.project.Controller.BarberShop;

import com.barber.project.Dto.Request.BarberShop.AddBarberRequest;
import com.barber.project.Dto.Request.BarberShop.UpdateBarberCommissionRequest;
import com.barber.project.Dto.Response.BarberShop.BarberResponse;
import com.barber.project.Dto.Response.Reservation.BarberDailySlotsResponse;
import com.barber.project.Service.Barber.AvailabilityService;
import com.barber.project.Service.BarberShop.BarberShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
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
@Tag(name = "Barbería - Gestión de Barberos")
@RestController
@RequestMapping("/api/barbershop")
@PreAuthorize("hasRole('BARBERIA')")
@RequiredArgsConstructor
public class BarberShopController {
    private final BarberShopService barberShopService;
    private final AvailabilityService availabilityService;

    //añadir barbero a la barberia
    @Operation(
            summary = "Vincular un barbero a la barbería",
            description = "Permite vincular un usuario con rol BARBERO a la barbería mediante su correo electrónico."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Barbero agregado correctamente"),
            @ApiResponse(responseCode = "404", description = "Barbero no encontrado", content = @Content),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    })


    @PostMapping("/barber")
    public ResponseEntity<String> addBarber(@Valid @RequestBody AddBarberRequest request){
       String message = barberShopService.addBarber(request.getEmail(), request.getBarberRequest());
        return ResponseEntity.ok(message);
    }

    //listar barberos
    @Operation(
            summary = "Listar barberos de la barbería",
            description = "Devuelve la lista de barberos vinculados a la barbería."
    )
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")

    @GetMapping("/barber")
    public ResponseEntity<List<BarberResponse>> listBarber(){
        List<BarberResponse> responses = barberShopService.listBarber();
        return ResponseEntity.ok(responses);
    }

    //actualizar commision
    @Operation(
            summary = "Actualizar comisión de un barbero",
            description = "Permite modificar el porcentaje o monto de comisión de un barbero."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comisión actualizada"),
            @ApiResponse(responseCode = "404", description = "Barbero no encontrado", content = @Content)
    })

    @PatchMapping("/barber/{barberId}/commission")
    public ResponseEntity<String> updateCommissionBarber(
            @PathVariable Long barberId,
            @Valid @RequestBody UpdateBarberCommissionRequest request
    ){
        String message = barberShopService.updateBarberCommission(barberId,request.getNewCommission());
        return ResponseEntity.ok(message);
    }

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
    @GetMapping("/barber/{barberId}/availability")
    public ResponseEntity<BarberDailySlotsResponse> getBarberAvailability(
            @PathVariable Long barberId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDate localDate = (date==null) ? LocalDate.now() : date;

        return ResponseEntity.ok(
                availabilityService.getBarberAvailabilityForShop(barberId, localDate)
        );
    }



    //cambiar estado de barberos

    // desactivar
    @Operation(summary = "Desactivar barbero")
    @PutMapping("/barber/{barberId}/status/desactivate")
    public ResponseEntity<?>desactivateBarber(@PathVariable Long barberId){
        barberShopService.desactivateBarber(barberId);
            return ResponseEntity.ok("Barbero desactivado correctamente");
    }

    // activar
    @Operation(summary = "Activar barbero")
    @PutMapping("/barber/{barberId}/status/activate")
    public ResponseEntity<?>activateBarber(@PathVariable Long barberId){
        barberShopService.activateBarber(barberId);
        return ResponseEntity.ok("Barbero activado correctamente");
    }
    // vacaciones
    @Operation(summary = "Poner barbero en vacaciones")
    @PutMapping("/barber/{barberId}/status/summary")
    public ResponseEntity<?>summaryBarber(@PathVariable Long barberId){
        barberShopService.summaryBarber(barberId);
        return ResponseEntity.ok("Barbero con vacaciones correctamente");
    }

    //barberia
    @Operation(summary = "Activar barbería")
    @PutMapping("/activate")
    public ResponseEntity<?> activate(){
        barberShopService.activateBarberShop();
        return ResponseEntity.ok("Barberia activada");
    }
    @Operation(summary = "Desactivar barbería")
    @PutMapping("/desactivate")
    public ResponseEntity<?> desactivate(){
        barberShopService.desactivateBarberShop();
        return ResponseEntity.ok("Barberia desactivada");
    }



}

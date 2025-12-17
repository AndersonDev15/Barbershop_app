package com.barber.project.Controller.BarberShop;

import com.barber.project.Dto.Request.BarberShop.OpeningHoursRequest;
import com.barber.project.Entity.OpeningHours;
import com.barber.project.Service.BarberShop.BarberShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@Tag(name = "Barbería - Horarios de Atención")
@RestController
@RequestMapping("/api/barbershop/opening-hours")
@PreAuthorize("hasRole('BARBERIA')")
@RequiredArgsConstructor
public class OpeningHoursAdminController {
    private final BarberShopService barberShopService;

    //crear horarios
    @Operation(
            summary = "Registrar horario de atención",
            description = "Crea un nuevo horario para la barbería. No permite duplicar días."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Horario registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o día duplicado", content = @Content)
    })

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody OpeningHoursRequest request){
        OpeningHours hours = barberShopService.createOpeningHours(request);
        return ResponseEntity.ok("Horario registrado correctamente");
    }

    //listar horarios
    @Operation(
            summary = "Listar horarios de atención",
            description = "Devuelve todos los horarios registrados por la barbería."
    )
    @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente")

    @GetMapping
    public ResponseEntity<?> list(){
        return ResponseEntity.ok(barberShopService.listOpeningHours());
    }

    //actualizar horario

    @Operation(
            summary = "Actualizar horario",
            description = "Modifica un horario existente de la barbería."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Horario actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Horario no encontrado", content = @Content)
    })

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody OpeningHoursRequest request){
        barberShopService.updateOpeningHours(id, request);
        return ResponseEntity.ok("Horario actualizado correctamente");
    }

    //eliminar horario
    @Operation(
            summary = "Eliminar horario",
            description = "Elimina un horario de atención."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Horario eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Horario no encontrado", content = @Content)
    })

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        barberShopService.deleteOpeningHours(id);
        return ResponseEntity.ok("Horario eliminado correctamente");
    }


}

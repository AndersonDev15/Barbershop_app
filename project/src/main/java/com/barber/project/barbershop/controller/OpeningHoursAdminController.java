package com.barber.project.barbershop.controller;

import com.barber.project.barbershop.dto.request.OpeningHoursRequest;
import com.barber.project.barbershop.dto.response.OpeningHoursResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barbershop.service.BarberShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<OpeningHoursResponse> create(
            @Valid @RequestBody OpeningHoursRequest request,
            @AuthenticationPrincipal CurrentUser currentUser){
        OpeningHoursResponse hours = barberShopService.createOpeningHours(request, currentUser.userUuid());
        return ResponseEntity.status(HttpStatus.CREATED).body(hours);
    }

    //listar horarios
    @Operation(
            summary = "Listar horarios de atención",
            description = "Devuelve todos los horarios registrados por la barbería."
    )
    @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente")

    @GetMapping
    public ResponseEntity<List<OpeningHoursResponse>> list(@AuthenticationPrincipal CurrentUser currentUser){
        List<OpeningHoursResponse> hoursResponses = barberShopService.listOpeningHours(currentUser.userUuid());
        return ResponseEntity.ok(hoursResponses);
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
    public ResponseEntity<OpeningHoursResponse> update(
            @PathVariable Long id,
            @RequestBody OpeningHoursRequest request,
            @AuthenticationPrincipal CurrentUser currentUser){
       OpeningHoursResponse response =  barberShopService.updateOpeningHours(id, request, currentUser.userUuid());
        return ResponseEntity.ok(response);
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
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal CurrentUser currentUser){
        barberShopService.deleteOpeningHours(id, currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }


}

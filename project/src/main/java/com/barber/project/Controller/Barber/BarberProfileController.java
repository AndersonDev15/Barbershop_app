package com.barber.project.Controller.Barber;

import com.barber.project.Dto.Request.Barber.BarberProfileUpdateRequest;
import com.barber.project.Dto.Response.Barber.BarberProfileResponse;
import com.barber.project.Service.Barber.BarberProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Perfil - Barbero")
@RestController
@RequestMapping("/api/barber/profile")
@PreAuthorize("hasRole('BARBERO')")
@RequiredArgsConstructor
public class BarberProfileController {

    private final BarberProfileService service;

    @Operation(
            summary = "Obtener perfil del barbero",
            description = """
                    Retorna toda la información del perfil del barbero autenticado.
                    - Nota: Para obtener los datos del barbero, el barbero debe estar asociado a una barberia
                    """

    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autenticado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado - El usuario no tiene rol BARBERO")
    })
    @GetMapping
    public BarberProfileResponse getProfile() {
        return service.getProfile();
    }


    @Operation(
            summary = "Actualizar perfil del barbero",
            description = "Permite al barbero autenticado modificar su información personal."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @PutMapping
    public BarberProfileResponse updateProfile(
            @Valid @RequestBody BarberProfileUpdateRequest request) {
        return service.updateProfile(request);
    }
}

package com.barber.project.Dto.Response.BarberShop;

import com.barber.project.Entity.enums.BarberStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@Schema(name = "BarberResponse", description = "Respuesta con información básica de un barbero")
public class BarberResponse {
    @Schema(description = "ID único del barbero", example = "15")
    private Long barberId;

    @Schema(description = "ID de usuario del barbero", example = "19")
    private Long userId;

    @Schema(description = "Correo electrónico", example = "carlos@email.com")
    private String email;

    @Schema(description = "Nombre del barbero", example = "Carlos")
    private String firstName;

    @Schema(description = "Apellido del barbero", example = "Ramírez")
    private String lastName;

    @Schema(description = "Teléfono de contacto", example = "3006549871")
    private String phone;

    @Schema(description = "Numero de documento del barbero", example = "10057865443")
    private String documentNumber;

    @Schema(description = "Commision asignada del barbero", example = "0.70")
    private BigDecimal commission;

    @Schema(description = "Estado del Barbero", example = "ACTIVO")
    private BarberStatus status;


}

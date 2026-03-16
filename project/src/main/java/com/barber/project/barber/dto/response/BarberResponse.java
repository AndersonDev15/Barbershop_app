package com.barber.project.barber.dto.response;

import com.barber.project.barber.entity.enums.BarberStatus;
import io.swagger.v3.oas.annotations.media.Schema;


import java.math.BigDecimal;


@Schema(name = "BarberResponse", description = "Respuesta con información básica de un barbero")
public record BarberResponse(
        @Schema(description = "ID único del barbero", example = "15")
        Long barberId,

        @Schema(description = "Correo electrónico", example = "carlos@email.com")
        String email,

        @Schema(description = "Nombre del barbero", example = "Carlos")
         String firstName,

        @Schema(description = "Apellido del barbero", example = "Ramírez")
        String lastName,

        @Schema(description = "Teléfono de contacto", example = "3006549871")
        String phone,

        @Schema(description = "Numero de documento del barbero", example = "10057865443")
         String documentNumber,

        @Schema(description = "Commision asignada del barbero", example = "0.70")
         BigDecimal commission,

        @Schema(description = "Estado del Barbero", example = "ACTIVO")
        BarberStatus status

) { }

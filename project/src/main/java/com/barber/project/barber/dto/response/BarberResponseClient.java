package com.barber.project.barber.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;


@Schema(name = "BarberResponse", description = "Respuesta con información básica de un barbero")
public record BarberResponseClient(

        @Schema(description = "ID único del barbero", example = "15")
         Long barberId,

        @Schema(description = "ID de usuario del barbero", example = "19")
         Long userId,

        @Schema(description = "Correo electrónico", example = "carlos@email.com")
         String email,

        @Schema(description = "Nombre del barbero", example = "Carlos")
         String firstName,

        @Schema(description = "Apellido del barbero", example = "Ramírez")
         String lastName,

        @Schema(description = "Teléfono de contacto", example = "3006549871")
         String phone,

        @Schema(description = "Numero de documento del barbero", example = "10057865443")
         String documentNumber

) { }

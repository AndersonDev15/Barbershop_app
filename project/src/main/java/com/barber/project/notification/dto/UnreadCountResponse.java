package com.barber.project.notification.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta con el conteo de notificaciones no leídas")
public record UnreadCountResponse(
        @Schema(description = "Número de notificaciones no leídas", example = "5")
        long count
) {}

package com.barber.project.notification.dto;

import com.barber.project.notification.enums.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Respuesta de una notificación")
public record NotificationResponse(
        @Schema(description = "ID de la notificación", example = "1")
        Long id,

        @Schema(description = "Tipo de notificación")
        NotificationType type,

        @Schema(description = "Título de la notificación", example = "Cita confirmada")
        String title,

        @Schema(description = "Mensaje de la notificación")
        String message,

        @Schema(description = "Indica si la notificación ha sido leída", example = "false")
        boolean read,

        @Schema(description = "Fecha de creación", example = "2025-01-15T14:30:00")
        LocalDateTime createdAt,

        @Schema(description = "ID de referencia (cita, invitación, etc.)", example = "120")
        Long referenceId
) {}

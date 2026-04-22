package com.barber.project.notification.controller;

import com.barber.project.notification.dto.NotificationResponse;
import com.barber.project.notification.dto.UnreadCountResponse;
import com.barber.project.notification.service.NotificationService;
import com.barber.project.Security.Jwt.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Notificaciones")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Obtener todas las notificaciones del usuario")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(notificationService.getNotifications(currentUser.userUuid()));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Obtener el conteo de notificaciones no leídas")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(notificationService.getUnreadCount(currentUser.userUuid()));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Marcar una notificación como leída")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CurrentUser currentUser) {
        notificationService.markAsRead(id, currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    @Operation(summary = "Marcar todas las notificaciones como leídas")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal CurrentUser currentUser) {
        notificationService.markAllAsRead(currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }
}

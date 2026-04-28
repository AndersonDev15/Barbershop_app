package com.barber.project.notification.service;

import com.barber.project.notification.dto.NotificationResponse;
import com.barber.project.notification.dto.UnreadCountResponse;
import com.barber.project.notification.entity.Notification;
import com.barber.project.notification.enums.NotificationType;
import com.barber.project.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;

    /**
     * Crea una nueva notificación para un usuario
     */
    public void createNotification(UUID userUuid, NotificationType type,
                                   String title, String message, Long referenceId) {
        Notification notification = new Notification();
        notification.setUserUuid(userUuid);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReferenceId(referenceId);
        notificationRepository.save(notification);
    }

    /**
     * Obtiene todas las notificaciones del usuario ordenadas por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(UUID userUuid) {
        return notificationRepository.findByUserUuidOrderByCreatedAtDesc(userUuid)
                .stream()
                .map(n -> new NotificationResponse(
                        n.getId(), n.getType(), n.getTitle(),
                        n.getMessage(), n.isRead(), n.getCreatedAt(), n.getReferenceId()))
                .toList();
    }

    /**
     * Marca una notificación como leída
     */
    public void markAsRead(Long id, UUID userUuid) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUserUuid().equals(userUuid)) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    /**
     * Marca todas las notificaciones del usuario como leídas
     */
    public void markAllAsRead(UUID userUuid) {
        notificationRepository.markAllAsRead(userUuid);
    }

    /**
     * Obtiene el conteo de notificaciones no leídas del usuario
     */
    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(UUID userUuid) {
        return new UnreadCountResponse(
                notificationRepository.countByUserUuidAndReadFalse(userUuid));
    }
}

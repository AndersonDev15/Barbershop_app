package com.auth.server.Service;

import com.auth.server.Repository.AuthIdentityRepository;
import com.auth.server.infrastructure.Dto.UserSyncRequest;
import com.auth.server.Entity.AuthIdentity;
import com.auth.server.infrastructure.Client.BusinessApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSyncNotificationService {
    private final BusinessApiClient businessApiClient;
    private final AuthIdentityRepository authIdentityRepository;

    //notificar sobre un usuario

    /**
     * Notificar a Business API
     * <p>
     * Si falla, solo logueamos el error y NO bloqueamos la actualización
     */
    public void notifyBusinessApi(AuthIdentity identity) {
        log.info("Notificando a Business API sobre usuario: {} ({})",
                identity.getUserUuid(),
                identity.getEmail()
        );

        try {
            UserSyncRequest syncRequest = UserSyncRequest.builder()
                    .userUuid(identity.getUserUuid())
                    .email(identity.getEmail())
                    .firstName(identity.getFirstName())
                    .lastName(identity.getLastName())
                    .phone(identity.getPhone())
                    .build();

            BusinessApiClient.SyncResponse response = businessApiClient.syncUser(syncRequest);

            if (response.success()) {
                identity.setLastSyncedAt(LocalDateTime.now());
                authIdentityRepository.save(identity);
                log.info("Business API sincronizada: {}", response.message());
            } else {
                log.warn("Business API reportó error para {}: {}", identity.getUserUuid(), response.message());
            }

        } catch (Exception e) {
            log.warn("Sync fallida para {}, se reintentará en reconciliación: {}",
                    identity.getUserUuid(), e.getMessage());
        }
    }
}

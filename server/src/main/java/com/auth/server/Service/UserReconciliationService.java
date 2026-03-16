package com.auth.server.Service;

import com.auth.server.infrastructure.Dto.UserSyncRequest;
import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Repository.AuthIdentityRepository;
import com.auth.server.infrastructure.Client.BusinessApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserReconciliationService {

    private final AuthIdentityRepository authIdentityRepository;
    private final BusinessApiClient businessApiClient;

    @Value("${reconciliation.enabled:true}")
    private boolean reconciliationEnabled;

    /**
     * Job de reconciliación diaria
     * Se ejecuta todos los días a las 2:00 AM
     *
     * Cron format: segundo minuto hora día mes día-semana
     * "0 0 2 * * *" = a las 2:00:00 AM todos los días
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void reconcileUsers() {
        if (!reconciliationEnabled) {
            log.info("Reconciliación deshabilitada en configuración");
            return;
        }

        log.info("========================================");
        log.info("Iniciando reconciliación diaria de usuarios");
        log.info("========================================");

        long startTime = System.currentTimeMillis();

        try {
            // ✅ solo usuarios pendientes de sync
            List<AuthIdentity> usersToSync = authIdentityRepository
                    .findPendingSync(LocalDateTime.now().minusHours(25));

            if (usersToSync.isEmpty()) {
                log.info("No hay usuarios para sincronizar");
                return;
            }

            AtomicInteger successCount = new AtomicInteger(0);
            AtomicInteger failureCount = new AtomicInteger(0);

            usersToSync.forEach(user -> {
                try {
                    syncUser(user);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                    log.error("Error al sincronizar {}: {}", user.getEmail(), e.getMessage());
                }
            });

            long duration = System.currentTimeMillis() - startTime;

            log.info("========================================");
            log.info("Reconciliación completada en {} ms", duration);
            log.info("Procesados: {} | Exitosos: {} | Fallidos: {}",
                    usersToSync.size(), successCount.get(), failureCount.get());
            log.info("========================================");

        } catch (Exception e) {
            log.error("Error crítico en reconciliación: {}", e.getMessage(), e);
        }
    }

    private void syncUser(AuthIdentity user) {
        log.debug("Sincronizando: {} - {}", user.getUserUuid(), user.getEmail());

        UserSyncRequest syncRequest = UserSyncRequest.builder()
                .userUuid(user.getUserUuid())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .build();

        BusinessApiClient.SyncResponse response = businessApiClient.syncUser(syncRequest);

        if (response.success()) {
            user.setLastSyncedAt(LocalDateTime.now());
            authIdentityRepository.save(user);
            log.debug("Usuario {} sincronizado", user.getEmail());
        } else {
            log.warn("Business API reportó error para {}: {}", user.getEmail(), response.message());
        }
    }

    public void reconcileUsersManually() {
        log.info("Reconciliación manual iniciada");
        reconcileUsers();
    }

}

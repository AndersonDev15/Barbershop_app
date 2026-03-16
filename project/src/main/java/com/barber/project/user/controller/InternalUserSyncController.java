package com.barber.project.user.controller;

import com.barber.project.infrastructure.sync.dto.SyncResponse;
import com.barber.project.infrastructure.sync.dto.UserSyncRequest;
import com.barber.project.user.entity.User;
import com.barber.project.infrastructure.sync.UserSyncService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
@Slf4j
public class InternalUserSyncController {

    private final UserSyncService userSyncService;

    /**
     * Endpoint que Auth Server llama cuando un usuario se crea o actualiza
     *
     * POST /internal/users/sync
     * Header: X-API-Key: <api-key>
     * Body: {
     *   "userUuid": "abc-123",
     *   "email": "user@example.com",
     *   "firstName": "John",
     *   "lastName": "Doe",
     *   "phone": "+57 300 1234567"
     * }
     */

    @PostMapping("/sync")
    public ResponseEntity<SyncResponse>syncUser(
            @RequestBody @Valid UserSyncRequest request){

        log.info("recibida solicitud de sincronizacion para usaurio: {}", request.getUserUuid());

        try {
            User synced = userSyncService.syncUser(request);
            return ResponseEntity.ok(new SyncResponse(
                    true,
                    "usuario sincronizado exitosamente",
                    synced.getUserUuid()
                    ));

        }catch (Exception e){
            log.error("Error al sincronizar usuario {}: {}",
                    request.getUserUuid(),
                    e.getMessage()
            );
            return ResponseEntity.internalServerError()
                    .body(new SyncResponse(
                            false,
                            "Error al sincronizar: " + e.getMessage(),
                            request.getUserUuid()
                    ));
        }
    }

}

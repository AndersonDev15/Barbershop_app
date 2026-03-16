package com.auth.server.infrastructure.Client;

import com.auth.server.Config.BusinessApiFeignConfig;
import com.auth.server.infrastructure.Dto.UserSyncRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Cliente Feign para comunicarse con Business API
 */
@FeignClient(
        name = "business-api",
        url = "${business.api.url}",
        configuration = BusinessApiFeignConfig.class
)
public interface BusinessApiClient {

    /**
     * Notificar a Business API que un usuario se creó o actualizó
     * <p>
     * POST http://localhost:8080/internal/users/sync
     * Header: X-API-Key: dev-auth-server-key-67890
     */
    @PostMapping("/internal/users/sync")
    SyncResponse syncUser(@RequestBody UserSyncRequest request);

    /**
     * DTO de respuesta de Business API
     */
    record SyncResponse(
            boolean success,
            String message,
            String userUuid
    ) { }
}
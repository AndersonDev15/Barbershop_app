package com.barber.project.infrastructure.sync.dto;

import java.util.UUID;

public record SyncResponse(
        boolean success,
        String message,
        UUID userUuid
) {
}

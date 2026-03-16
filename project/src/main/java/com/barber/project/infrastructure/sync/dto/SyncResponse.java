package com.barber.project.infrastructure.sync.dto;

public record SyncResponse(
        boolean success,
        String message,
        String userUuid
) {
}

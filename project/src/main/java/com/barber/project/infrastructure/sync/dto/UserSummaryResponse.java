package com.barber.project.infrastructure.sync.dto;

import java.util.UUID;

public record UserSummaryResponse(
        UUID userUuid,
        String email,
        String firstName,
        String lastName,
        String phone
) {}

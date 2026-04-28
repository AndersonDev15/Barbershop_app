package com.auth.server.infrastructure.Dto;

import java.util.UUID;

public record UserSummaryResponse(
        UUID userUuid,
        String email,
        String firstName,
        String lastName,
        String phone
) {}

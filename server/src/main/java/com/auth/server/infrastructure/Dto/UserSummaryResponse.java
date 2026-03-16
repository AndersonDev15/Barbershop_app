package com.auth.server.infrastructure.Dto;

public record UserSummaryResponse(
        String userUuid,
        String email,
        String firstName,
        String lastName,
        String phone
) {}

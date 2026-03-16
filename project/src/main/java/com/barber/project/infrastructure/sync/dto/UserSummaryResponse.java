package com.barber.project.infrastructure.sync.dto;

public record UserSummaryResponse(
        String userUuid,
        String email,
        String firstName,
        String lastName,
        String phone
) {}

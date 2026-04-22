package com.auth.server.Dto.Response;

import com.auth.server.Entity.AuthIdentity;

public record UserResponse(
        String userUuid,
        String email,
        String firstName,
        String lastName,
        String phone
) {
    public static UserResponse from(AuthIdentity identity) {
        return new UserResponse(
                identity.getUserUuid(),
                identity.getEmail(),
                identity.getFirstName(),
                identity.getLastName(),
                identity.getPhone()
        );
    }
}

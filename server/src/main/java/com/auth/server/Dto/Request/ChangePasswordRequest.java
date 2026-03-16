package com.auth.server.Dto.Request;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword,
        String confirmNewPassword
) {}

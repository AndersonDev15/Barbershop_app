package com.auth.server.Dto.Request;

public record ResetPasswordRequest (
        String email,
        String otp,
        String newPassword
){}

package com.auth.server.Dto.Request;

public record RegisterRequest(
        String firstName,
        String lastName,
        String phone,
        String email,
        String password,
        String role

) { }

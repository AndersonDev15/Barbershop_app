package com.auth.server.Dto.Response;

public record UserSummaryResponse (
        String userUuid,
        String firstName,
        String lastName,
        String email,
        String phone

){}

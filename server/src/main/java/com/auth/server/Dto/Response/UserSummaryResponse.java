package com.auth.server.Dto.Response;

import java.util.UUID;

public record UserSummaryResponse (
        UUID userUuid,
        String firstName,
        String lastName,
        String email,
        String phone

){}

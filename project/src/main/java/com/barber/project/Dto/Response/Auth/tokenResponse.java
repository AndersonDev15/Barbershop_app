package com.barber.project.Dto.Response.Auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class tokenResponse {
    private String token;
}

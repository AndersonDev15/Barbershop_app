package com.auth.server.Dto.Request;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public record UpdateUserRequest(
         String firstName,

         String lastName,

        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Formato de teléfono inválido")
        String phone
) { }
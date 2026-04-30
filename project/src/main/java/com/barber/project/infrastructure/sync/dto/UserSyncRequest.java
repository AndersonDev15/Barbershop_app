package com.barber.project.infrastructure.sync.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSyncRequest {



    // DESPUÉS:
    @NotNull(message = "userUuid es requerido")  // ← NotNull, no NotBlank
    private UUID userUuid;

    @NotBlank(message = "email es requerido")
    @Email(message = "email debe ser valido")
    private String email;

    @NotBlank(message = "firstName es requerido")
    private String firstName;

    @NotBlank(message = "lastName es requerido")
    private String lastName;

    private String phone;
}
package com.barber.project.infrastructure.sync.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSyncRequest {

    @NotBlank(message = "userUuid es requerido")
    private String userUuid;

    @NotBlank(message = "email es requerido")
    @Email(message = "email debe ser valido")
    private String email;

    @NotBlank(message = "fistName es requerido")
    private String firstName;

    @NotBlank(message = "lastName es requerido")
    private String lastName;

    private String phone;
}

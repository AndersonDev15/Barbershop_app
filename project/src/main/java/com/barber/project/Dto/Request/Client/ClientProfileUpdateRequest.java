package com.barber.project.Dto.Request.Client;

import com.barber.project.Dto.Request.Authentication.UserProfileUpdateRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(description = "Datos para actualizar el perfil del cliente")
public class ClientProfileUpdateRequest extends UserProfileUpdateRequest {

    public ClientProfileUpdateRequest(String firstName, String lastName, String phone) {
        super(firstName, lastName, phone);

    }


}

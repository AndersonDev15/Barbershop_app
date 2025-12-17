package com.barber.project.Dto.Request.Barber;

import com.barber.project.Dto.Request.Authentication.UserProfileUpdateRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(description = "Datos para actualizar el perfil del barbero")
public class BarberProfileUpdateRequest extends UserProfileUpdateRequest {

    public BarberProfileUpdateRequest(String firstName, String lastName, String phone){
        super(firstName,lastName,phone);
    }


}

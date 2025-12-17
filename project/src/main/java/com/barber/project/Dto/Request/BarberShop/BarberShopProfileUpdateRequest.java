package com.barber.project.Dto.Request.BarberShop;

import com.barber.project.Dto.Request.Authentication.UserProfileUpdateRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(description = "Datos para actualizar el perfil de la barbería")
public class BarberShopProfileUpdateRequest extends UserProfileUpdateRequest {
    @Schema(description = "Nombre comercial de la barbería", example = "Barbería Elegante")
    private String barberShopName;

    @Schema(description = "Dirección de la barbería", example = "Calle 123 #45-67")
    private String address;

    @Schema(description = "Teléfono de contacto de la barbería", example = "3009876543")
    private String barberShopPhone;

    public BarberShopProfileUpdateRequest(String firstName, String lastName, String phone,  String barberShopName, String address, String barberShopPhone) {
        super(firstName, lastName, phone);
        this.barberShopName = barberShopName;
        this.address = address;
        this.barberShopPhone = barberShopPhone;
    }
}

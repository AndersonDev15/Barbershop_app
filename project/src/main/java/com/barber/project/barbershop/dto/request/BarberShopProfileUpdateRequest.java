package com.barber.project.barbershop.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(description = "Datos para actualizar el perfil de la barbería")
public class BarberShopProfileUpdateRequest  {
    @Schema(description = "Nombre comercial de la barbería", example = "Barbería Elegante")
    private String barberShopName;

    @Schema(description = "Dirección de la barbería", example = "Calle 123 #45-67")
    private String address;

    @Schema(description = "Teléfono de contacto de la barbería", example = "3009876543")
    private String barberShopPhone;


}

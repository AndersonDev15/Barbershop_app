package com.barber.project.barbershop.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(description = "Datos para actualizar el perfil de la barbería")
public class BarberShopProfileUpdateRequest  {
    @Schema(description = "Nombre comercial de la barbería", example = "Barbería Elegante")
    private String barberShopName;

    @Schema(description = "Departamento donde se encuentra la barbería", example = "Cundinamarca")
    String department;
    @Schema(description = "Ciudad donde se encuentra la barbería", example = "Bogotá")
    String city;

    @Schema(description = "Dirección de la barbería", example = "Calle 123 #45-67")
    private String address;



    @Schema(description = "Teléfono de contacto de la barbería", example = "3009876543")
    private String barberShopPhone;


}

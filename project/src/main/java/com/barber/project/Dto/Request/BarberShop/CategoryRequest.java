package com.barber.project.Dto.Request.BarberShop;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@Schema(description = "Datos necesarios para crear o actualizar un servicio (categoría) de la barbería")
public class CategoryRequest {

    @Schema(
            description = "Nombre del servicio que se ofrece en la barbería",
            example = "Corte de cabello"
    )
    @NotBlank(message = "El nombre del servicio es requerido")
    private String name;

    @Schema(
            description = "Descripción breve del servicio",
            example = "Corte con máquina y tijera, estilo a elección."
    )
    @NotBlank(message = "La descripcion es requerida")
    private String description;
}


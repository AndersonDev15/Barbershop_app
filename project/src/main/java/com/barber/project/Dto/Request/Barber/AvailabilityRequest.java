package com.barber.project.Dto.Request.Barber;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class AvailabilityRequest {
    @Schema(
            description = "ID del barbero al que se desea consultar la disponibilidad.",
            example = "12"
    )
    @NotNull
    private Long barberId;

    @Schema(
            description = "Listado de IDs de subcategorías de servicio que el cliente está solicitando.",
            example = "[3, 5, 7]"
    )
    @NotEmpty
    private List<Long> subcategoryIds;

    @Schema(
            description = "Fecha para la cual se va a consultar la disponibilidad.",
            example = "2025-03-15"
    )
    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate date;
}

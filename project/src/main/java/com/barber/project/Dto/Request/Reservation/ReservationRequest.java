package com.barber.project.Dto.Request.Reservation;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@Schema(description = "Solicitud para crear una reserva")
public class ReservationRequest {

    @NotNull
    @Schema(description = "ID del barbero seleccionado", example = "5")
    private Long barberId;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Schema(description = "Fecha de la reserva (YYYY-MM-DD)", example = "2025-01-15")
    private LocalDate date;

    @NotNull
    @Schema(description = "Hora de inicio de la reserva (HH:mm)", example = "14:30")
    private LocalTime startTime;

    @NotEmpty
    @Schema(description = "Lista de IDs de subcategorías (servicios) que el cliente desea agendar",
            example = "[1, 4, 7]")
    private List<Long> subcategoryIds;
}

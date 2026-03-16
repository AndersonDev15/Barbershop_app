package com.barber.project.transaction.dto.request;

import com.barber.project.transaction.entity.enums.PaymentMethodStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;


public record TransactionRequest(
        @NotNull(message = "El ID de la reservación es obligatorio")
        Long reservationId,

        @NotNull(message = "El método de pago es obligatorio")
        PaymentMethodStatus paymentMethod,

        @NotNull(message = "El monto total es obligatorio")
        @Positive(message = "El monto total debe ser positivo")
        BigDecimal totalAmount,

        @PositiveOrZero(message = "La propina debe ser cero o un valor positivo")
        BigDecimal tip,

        @NotBlank(message = "Las notas son obligatorias")
        String notes
) { }
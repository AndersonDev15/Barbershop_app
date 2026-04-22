package com.barber.project.transaction.dto.request;

import com.barber.project.transaction.entity.enums.PaymentMethodStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record PaymentRequest(

        @NotNull(message = "El método de pago es obligatorio")
        PaymentMethodStatus paymentMethod,

        @PositiveOrZero(message = "La propina debe ser cero o positiva")
        BigDecimal tip,

        @NotBlank(message = "Las notas son obligatorias")
        String notes
) { }
package com.barber.project.Dto.Request.Transaction;

import com.barber.project.Entity.enums.PaymentMethodStatus;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class TransactionRequest {
    @NotNull
    private Long reservationId;

    @NotNull
    private PaymentMethodStatus paymentMethod;

    @NotNull
    @Positive
    private BigDecimal totalAmount;

    @PositiveOrZero
    private BigDecimal tip = BigDecimal.ZERO;


    @NotBlank
    private String notes;
}

package com.barber.project.transaction.dto.response;

import com.barber.project.transaction.entity.enums.PaymentMethodStatus;
import com.barber.project.transaction.entity.enums.PaymentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Schema(
        name = "TransactionResponse",
        description = "Información completa de la transacción generada."
)
public record TransactionResponse(
        @Schema(description = "ID de la transacción.", example = "1001")
         Long id,

        @Schema(description = "Código único de la transacción.", example = "TRX-20250110-AB12")
         String transactionCode,

        @Schema(description = "ID de la reserva asociada.", example = "15")
         Long reservationId,

        @Schema(description = "ID del barbero que realizó el servicio.", example = "8")
         Long barberId,

        @Schema(description = "Monto total del servicio.", example = "35000.00")
         BigDecimal totalAmount,

        @Schema(description = "Propina recibida.", example = "5000.00")
         BigDecimal tip,

        @Schema(description = "Método de pago utilizado.", example = "EFECTIVO")
         PaymentMethodStatus paymentMethod,

        @Schema(description = "Estado actual del pago.", example = "PAGADO")
         PaymentStatus paymentStatus,

        @Schema(description = "Fecha y hora en que se registró el pago.", example = "2025-01-10T14:35:22")
         LocalDateTime paymentDate,

        @Schema(description = "Notas o comentarios sobre la transacción.", example = "Pago recibido sin novedades.")
         String notes
) { }

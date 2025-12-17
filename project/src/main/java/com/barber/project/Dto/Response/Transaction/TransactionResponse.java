package com.barber.project.Dto.Response.Transaction;

import com.barber.project.Entity.enums.PaymentMethodStatus;
import com.barber.project.Entity.enums.PaymentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@Schema(
        name = "TransactionResponse",
        description = "Información completa de la transacción generada."
)
public class TransactionResponse {

        @Schema(description = "ID de la transacción.", example = "1001")
        private Long id;

        @Schema(description = "Código único de la transacción.", example = "TRX-20250110-AB12")
        private String transactionCode;

        @Schema(description = "ID de la reserva asociada.", example = "15")
        private Long reservationId;

        @Schema(description = "ID del barbero que realizó el servicio.", example = "8")
        private Long barberId;

        @Schema(description = "Monto total del servicio.", example = "35000.00")
        private BigDecimal totalAmount;

        @Schema(description = "Propina recibida.", example = "5000.00")
        private BigDecimal tip;

        @Schema(description = "Método de pago utilizado.", example = "EFECTIVO")
        private PaymentMethodStatus paymentMethod;

        @Schema(description = "Estado actual del pago.", example = "PAGADO")
        private PaymentStatus paymentStatus;

        @Schema(description = "Fecha y hora en que se registró el pago.", example = "2025-01-10T14:35:22")
        private LocalDateTime paymentDate;

        @Schema(description = "Notas o comentarios sobre la transacción.", example = "Pago recibido sin novedades.")
        private String notes;
}

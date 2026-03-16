package com.barber.project.transaction.dto.response;

import com.barber.project.transaction.entity.enums.PaymentMethodStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Schema(
        name = "BarberShopIncomeResponse",
        description = "Detalle de ingresos generados para la barbería y el barbero."
)
public record BarberShopIncomeResponse (
        @Schema(description = "ID del registro de ingresos.", example = "550")
         Long id,

        @Schema(description = "ID de la transacción asociada.", example = "1001")
         Long transactionId,

        @Schema(description = "ID de la barbería.", example = "3")
         Long barberShopId,

        @Schema(description = "ID del barbero.", example = "8")
         Long barberId,

        @Schema(description = "Monto total recibido por la transacción.", example = "35000.00")
         BigDecimal totalAmount,

        @Schema(description = "Monto que corresponde a la barbería.", example = "10500.00")
         BigDecimal barberShopAmount,

        @Schema(description = "Monto que corresponde al barbero.", example = "24500.00")
         BigDecimal barberAmount,

        @Schema(description = "Propina asignada al barbero.", example = "5000.00")
         BigDecimal tipAmount,

        @Schema(description = "Porcentaje de comisión aplicado por la barbería.", example = "30")
         BigDecimal commissionPercentage,

        @Schema(description = "Método de pago utilizado.", example = "EFECTIVO")
         PaymentMethodStatus paymentMethod,

        @Schema(description = "Código de la transacción asociada.", example = "TRX-20250110-AB12")
         String transactionCode,

        @Schema(description = "Fecha de la transacción.", example = "2025-01-10T14:35:22")
         LocalDateTime transactionDate,

        @Schema(description = "Fecha de creación del registro de ingresos.", example = "2025-01-10T14:40:00")
         LocalDateTime creationDate,

        @Schema(description = "Notas adicionales.", example = "Servicio completado sin novedades.")
         String note
) {


}

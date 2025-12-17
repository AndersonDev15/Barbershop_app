package com.barber.project.Dto.Response.Transaction;

import com.barber.project.Entity.enums.PaymentMethodStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Schema(
        name = "BarberShopIncomeResponse",
        description = "Detalle de ingresos generados para la barbería y el barbero."
)
public class BarberShopIncomeResponse {

    @Schema(description = "ID del registro de ingresos.", example = "550")
    private Long id;

    @Schema(description = "ID de la transacción asociada.", example = "1001")
    private Long transactionId;

    @Schema(description = "ID de la barbería.", example = "3")
    private Long barberShopId;

    @Schema(description = "ID del barbero.", example = "8")
    private Long barberId;

    @Schema(description = "Monto total recibido por la transacción.", example = "35000.00")
    private BigDecimal totalAmount;

    @Schema(description = "Monto que corresponde a la barbería.", example = "10500.00")
    private BigDecimal barberShopAmount;

    @Schema(description = "Monto que corresponde al barbero.", example = "24500.00")
    private BigDecimal barberAmount;

    @Schema(description = "Propina asignada al barbero.", example = "5000.00")
    private BigDecimal tipAmount = BigDecimal.ZERO;

    @Schema(description = "Porcentaje de comisión aplicado por la barbería.", example = "30")
    private BigDecimal commissionPercentage;

    @Schema(description = "Método de pago utilizado.", example = "EFECTIVO")
    private PaymentMethodStatus paymentMethod;

    @Schema(description = "Código de la transacción asociada.", example = "TRX-20250110-AB12")
    private String transactionCode;

    @Schema(description = "Fecha de la transacción.", example = "2025-01-10T14:35:22")
    private LocalDateTime transactionDate;

    @Schema(description = "Fecha de creación del registro de ingresos.", example = "2025-01-10T14:40:00")
    private LocalDateTime creationDate;

    @Schema(description = "Notas adicionales.", example = "Servicio completado sin novedades.")
    private String note;
}

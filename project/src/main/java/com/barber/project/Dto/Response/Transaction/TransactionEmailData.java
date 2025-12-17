package com.barber.project.Dto.Response.Transaction;

import com.barber.project.Dto.Response.Reservation.ServiceInfo;
import com.barber.project.Entity.enums.PaymentMethodStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record TransactionEmailData(
        // Transacción
        Long transactionId,
        String transactionCode,
        LocalDateTime transactionDate,
        BigDecimal totalAmount,
        BigDecimal tipAmount,
        BigDecimal barberCommission,
        BigDecimal barberShopShare,
        PaymentMethodStatus paymentMethod,

        // Cliente
        String clientName,
        String clientEmail,
        String clientPhone,

        // Barbero
        String barberName,
        String barberEmail,

        // Barbería
        String barberShopName,
        String barberShopEmail,
        String barberShopAddress,
        String barberShopPhone,

        // Reserva relacionada
        Long reservationId,
        LocalDate reservationDate,
        LocalTime reservationTime,

        // Servicios
        List<ServiceInfo> services
) {}

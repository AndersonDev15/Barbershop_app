package com.barber.project.reservation.dto.internal;

import com.barber.project.reservation.dto.response.ServiceInfo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record ReservationEmailData(
        Long reservationId,

        String clientName,
        String clientEmail,
        String clientPhone,

        String barberName,
        String barberEmail,

        String barberShopName,
        String barberShopAddress,

        LocalDate date,
        LocalTime startTime,

        BigDecimal totalPrice,
        int totalDuration,

        List<ServiceInfo> services
) {}
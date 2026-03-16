package com.barber.project.reservation.dto.internal;

import com.barber.project.reservation.entity.enums.ReservationStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record CancellationEmailData(
        Long reservationId,
        String clientName,
        String clientEmail,
        String barberName,
        String barberEmail,
        LocalDate date,
        LocalTime startTime,
        ReservationStatus oldStatus
) {}

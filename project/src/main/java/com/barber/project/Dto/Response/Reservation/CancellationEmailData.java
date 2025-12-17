package com.barber.project.Dto.Response.Reservation;

import com.barber.project.Entity.enums.ReservationStatus;

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

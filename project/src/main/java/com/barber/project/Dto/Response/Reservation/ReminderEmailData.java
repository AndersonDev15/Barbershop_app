package com.barber.project.Dto.Response.Reservation;

import java.util.List;

public record ReminderEmailData(
        Long reservationId,
        String clientName,
        String barberName,
        List<ServiceInfo> services,
        String date,
        String startTime,
        String clientEmail,
        String barberEmail
) {}

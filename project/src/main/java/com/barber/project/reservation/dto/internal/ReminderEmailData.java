package com.barber.project.reservation.dto.internal;

import com.barber.project.reservation.dto.response.ServiceInfo;

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

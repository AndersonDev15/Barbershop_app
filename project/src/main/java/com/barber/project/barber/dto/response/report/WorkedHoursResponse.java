package com.barber.project.barber.dto.response.report;


public record WorkedHoursResponse(
         int totalAppointments,
         String hours
) { }

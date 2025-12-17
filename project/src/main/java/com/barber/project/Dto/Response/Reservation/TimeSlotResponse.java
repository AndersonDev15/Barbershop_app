package com.barber.project.Dto.Response.Reservation;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class TimeSlotResponse {
    private LocalTime time;
    private String status; // "DISPONIBLE" o "OCUPADO
}

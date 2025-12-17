package com.barber.project.Dto.Response.Barber;

import com.barber.project.Entity.Barber;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
@AllArgsConstructor
public class BarberBreakResponse {
    private Long id;
    private LocalTime start;
    private LocalTime end;
    private LocalDate date;
    private String barber;
}

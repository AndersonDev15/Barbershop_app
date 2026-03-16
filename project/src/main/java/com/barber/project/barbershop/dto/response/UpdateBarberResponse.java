package com.barber.project.barbershop.dto.response;

import com.barber.project.barber.entity.Barber;
import com.barber.project.barber.entity.enums.BarberStatus;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record UpdateBarberResponse(
        Long barberId,
        String documentNumber,
        BigDecimal commission,
        BarberStatus status
) {
    public static UpdateBarberResponse from(Barber barber) {
        return UpdateBarberResponse.builder()
                .barberId(barber.getId())
                .documentNumber(barber.getDocumentNumber())
                .commission(barber.getCommission())
                .status(barber.getStatus())
                .build();
    }
}

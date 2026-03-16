package com.barber.project.reservation.service.mapper;

import com.barber.project.reservation.dto.response.ReservationResponse;
import com.barber.project.reservation.dto.response.ServiceInfo;
import com.barber.project.reservation.entity.Reservation;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReservationMapper {

    public ReservationResponse toResponse(
            Reservation reservation,
            List<ServiceInfo> services
    ) {

        return new ReservationResponse(
                reservation.getId(),
                reservation.getBarber().getUser().getFirstName(),
                reservation.getClient().getUser().getFirstName(),
                services,
                reservation.getDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getFinalPrice(),
                reservation.getStatus()
        );
    }

}
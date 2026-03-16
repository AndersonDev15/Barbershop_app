package com.barber.project.reservation.service.email;

import com.barber.project.reservation.entity.enums.ReservationStatus;
import com.barber.project.reservation.dto.internal.CancellationEmailData;
import com.barber.project.reservation.dto.internal.ReservationEmailData;
import com.barber.project.reservation.dto.response.ServiceInfo;
import com.barber.project.reservation.entity.Reservation;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReservationEmailFactory {

    public ReservationEmailData buildEmailData(
            Reservation reservation,
            List<ServiceInfo> services
    ) {

        return new ReservationEmailData(
                reservation.getId(),
                reservation.getClient().getUser().getFirstName(),
                reservation.getClient().getUser().getEmail(),
                reservation.getClient().getUser().getPhone(),
                reservation.getBarber().getUser().getFirstName() + " "
                        + reservation.getBarber().getUser().getLastName(),
                reservation.getBarber().getUser().getEmail(),
                reservation.getBarber().getBarberShop().getName(),
                reservation.getBarber().getBarberShop().getAddress(),
                reservation.getDate(),
                reservation.getStartTime(),
                reservation.getFinalPrice(),
                services.stream().mapToInt(ServiceInfo::duration).sum(),
                services
        );
    }

    public CancellationEmailData buildCancellationEmailData(
            Reservation reservation,
            ReservationStatus oldStatus
    ) {

        return new CancellationEmailData(
                reservation.getId(),
                reservation.getClient().getUser().getFirstName(),
                reservation.getClient().getUser().getEmail(),
                reservation.getBarber().getUser().getFirstName() + " "
                        + reservation.getBarber().getUser().getLastName(),
                reservation.getBarber().getUser().getEmail(),
                reservation.getDate(),
                reservation.getStartTime(),
                oldStatus
        );
    }
}
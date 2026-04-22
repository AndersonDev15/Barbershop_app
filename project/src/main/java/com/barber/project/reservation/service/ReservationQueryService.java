package com.barber.project.reservation.service;

import com.barber.project.reservation.entity.Reservation;
import com.barber.project.reservation.repository.ReservationRepository;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationQueryService {

    private final ReservationRepository reservationRepository;

    public Reservation getById(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reserva no encontrada"));
    }
}

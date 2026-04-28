package com.barber.project.barber.service;


import com.barber.project.barber.dto.response.BarberProfileResponse;
import com.barber.project.barber.entity.Barber;
import com.barber.project.user.entity.User;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.barber.repository.BarberRepository;
import com.barber.project.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BarberProfileService {
    private final UserService userService;
    private final BarberRepository barberRepository;


    @Transactional(readOnly = true)
    public BarberProfileResponse getProfile(UUID userUuid) {
        Barber barber = barberRepository.findByUser_UserUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));
        return mapToResponse(barber.getUser(), barber);
    }



    private BarberProfileResponse mapToResponse(User user, Barber barber) {
        return new BarberProfileResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                barber.getDocumentNumber(),
                barber.getCommission(),
                barber.getBarberShop().getName()

        );
    }

}


package com.barber.project.barber.service;


import com.barber.project.barber.dto.internal.BarberValidationResult;
import com.barber.project.barber.entity.Barber;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.service.BarberShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.rmi.server.UID;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BarberValidationService {
    private final BarberService barberService;
    private final BarberShopService barberShopService;

    public BarberValidationResult validateBarberAndShop(Long barberId){
        Barber barber = barberService.getBarberById(barberId);
        barberService.validateBarberIsActive(barber);

        BarberShop barberShop = barber.getBarberShop();
        barberShopService.ensureActive(barberShop);
        return new BarberValidationResult(barber,barberShop);
    }
    public BarberValidationResult validateAuthenticatedBarber(UUID userUuid) {
        Barber barber = barberService.getBarberByUserUuid(userUuid);
        barberService.validateBarberIsActive(barber);

        BarberShop barberShop = barber.getBarberShop();
        barberShopService.ensureActive(barberShop);

        return new BarberValidationResult(barber, barberShop);
    }

}



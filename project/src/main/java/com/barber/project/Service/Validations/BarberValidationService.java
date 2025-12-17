package com.barber.project.Service.Validations;

import com.barber.project.Dto.Validations.BarberValidationResult;
import com.barber.project.Entity.Barber;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Service.Barber.BarberService;
import com.barber.project.Service.BarberShop.BarberShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    public BarberValidationResult validateAuthenticatedBarber() {
        Barber barber = barberService.getAuthenticatedBarber();
        barberService.validateBarberIsActive(barber);

        BarberShop barberShop = barber.getBarberShop();
        barberShopService.ensureActive(barberShop);

        return new BarberValidationResult(barber, barberShop);
    }

}

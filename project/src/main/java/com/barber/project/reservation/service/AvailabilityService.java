package com.barber.project.reservation.service;


import com.barber.project.reservation.dto.request.AvailabilityRequest;
import com.barber.project.barber.service.BarberService;
import com.barber.project.barber.service.BarberValidationService;
import com.barber.project.reservation.dto.response.AvailabilityResponse;
import com.barber.project.reservation.dto.response.BarberDailySlotsResponse;
import com.barber.project.reservation.dto.response.SlotInfo;
import com.barber.project.barber.dto.internal.BarberValidationResult;
import com.barber.project.reservation.dto.internal.ServiceCalculationResult;
import com.barber.project.barber.entity.Barber;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.service.BarberShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;



@Service
@RequiredArgsConstructor
public class AvailabilityService {
    private final SlotValidationService slotValidationService;
    private final BarberValidationService validationService;
    private final ReservationCalculationService calculationService;
    private final BarberService barberService;
    private final BarberShopService barberShopService;




    //para el cliente: ver disponibilidad
    @Transactional(readOnly = true)
    public AvailabilityResponse getAvailabilityForClient(AvailabilityRequest request) {
        //validar barbero y barberia
        BarberValidationResult validation = validationService.validateBarberAndShop(request.barberId());
        //calculos
        ServiceCalculationResult calculationResult = calculationService.calculateServices(request.subcategoryIds());

        //disponibilidad
        List<SlotInfo> slots = slotValidationService.calculateAvailableSlots(
                validation.barber().getId(),
                request.date(),
                validation.barberShop(),
                request.date().getDayOfWeek()
        );



        return new AvailabilityResponse(
                validation.barber().getId(),
                validation.barber().getUser().getFirstName(),
                request.date(),
                calculationResult.services(),
                calculationResult.totalDuration(),
                calculationResult.requiredBlocks(),
                calculationResult.totalPrice(),
                slots
        );
    }

    // para el barbero: Ver su propia disponibilidad
    @Transactional(readOnly = true)
    public BarberDailySlotsResponse getBarberSelfAvailability(UUID userUuid, LocalDate date) {

        BarberValidationResult validation = validationService.validateAuthenticatedBarber(userUuid);

        List<SlotInfo> allSlots = slotValidationService.calculateAvailableSlots(
                validation.barber().getId(),
                date,
                validation.barberShop(),
                date.getDayOfWeek()
        );

        return new BarberDailySlotsResponse(
                validation.barber().getId(),
                validation.barber().getUser().getFirstName() + " " + validation.barber().getUser().getLastName(),
                date,
                allSlots
        );
    }


    // para barberia: Ver disponibilidad de un barbero
    @Transactional(readOnly = true)
    public BarberDailySlotsResponse getBarberAvailabilityForShop(Long barberId, LocalDate date, UUID ownerUuid ) {

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        barberShopService.ensureActive(barberShop);


        Barber barber = barberService.getBarberByIdAndBarberShopId(barberId,barberShop.getId());

        List<SlotInfo> allSlots = slotValidationService.calculateAvailableSlots(
                barber.getId(),
                date,
                barber.getBarberShop(),
                date.getDayOfWeek()
        );

        return new BarberDailySlotsResponse(
                barber.getId(),
                barber.getUser().getFirstName() + " " + barber.getUser().getLastName(),
                date,
                allSlots
        );
    }


}


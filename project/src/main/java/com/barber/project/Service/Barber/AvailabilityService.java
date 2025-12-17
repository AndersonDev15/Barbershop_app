package com.barber.project.Service.Barber;

import com.barber.project.Dto.Request.Barber.AvailabilityRequest;
import com.barber.project.Dto.Response.Reservation.AvailabilityResponse;
import com.barber.project.Dto.Response.Reservation.BarberDailySlotsResponse;
import com.barber.project.Dto.Response.Reservation.ServiceInfo;
import com.barber.project.Dto.Response.Reservation.SlotInfo;
import com.barber.project.Dto.Validations.BarberValidationResult;
import com.barber.project.Dto.Validations.ServiceCalculationResult;
import com.barber.project.Entity.*;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberRepository;
import com.barber.project.Service.BarberShop.BarberShopService;
import com.barber.project.Service.Validations.BarberValidationService;
import com.barber.project.Service.Validations.ReservationCalculationService;
import com.barber.project.Service.Validations.SlotValidationService;
import jakarta.validation.ValidationException;
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
    private final BarberRepository barberRepository;



    //para el cliente: ver disponibilidad
    @Transactional(readOnly = true)
    public AvailabilityResponse getAvailabilityResponse(AvailabilityRequest request) {

        //validar barbero y barberia
        BarberValidationResult validation = validationService.validateBarberAndShop(request.getBarberId());

        //calculos
        ServiceCalculationResult calculationResult = calculationService.calculateServices(request.getSubcategoryIds());

        //disponibilidad
        List<SlotInfo> slots = slotValidationService.calculateAvailableSlots(
                validation.barber().getId(),
                request.getDate(),
                validation.barberShop(),
                request.getDate().getDayOfWeek()
        );



        return AvailabilityResponse.builder()
                .barberId(validation.barber().getId())
                .barber(validation.barber().getUser().getFirstName())
                .date(request.getDate())
                .selectedServices(mapToServiceInfo(calculationResult.services()))
                .totalDuration(calculationResult.totalDuration())
                .requiredBlocks(calculationResult.requiredBlocks())
                .totalPrice(calculationResult.totalPrice())
                .slots(slots)
                .build();
    }

    // para el barbero: Ver su propia disponibilidad
    public BarberDailySlotsResponse getBarberSelfAvailability(LocalDate date) {

        Barber barber = barberService.getAuthenticatedBarber();

        List<SlotInfo> allSlots = slotValidationService.calculateAvailableSlots(
                barber.getId(),
                date,
                barber.getBarberShop(),
                date.getDayOfWeek()
        );

        return BarberDailySlotsResponse.builder()
                .barberId(barber.getId())
                .barberName(barber.getUser().getFirstName() + " " + barber.getUser().getLastName())
                .date(date)
                .allSlots(allSlots)
                .build();
    }


    // para barberia: Ver disponibilidad de un barbero
    public BarberDailySlotsResponse getBarberAvailabilityForShop(Long barberId, LocalDate date) {

        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));

        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();

        // barbero pertenece a esta barbería
        if (!barber.getBarberShop().getId().equals(barberShop.getId())) {
            throw new ValidationException("Este barbero no trabaja en tu barbería");
        }

        List<SlotInfo> allSlots = slotValidationService.calculateAvailableSlots(
                barber.getId(),
                date,
                barber.getBarberShop(),
                date.getDayOfWeek()
        );

        return BarberDailySlotsResponse.builder()
                .barberId(barber.getId())
                .barberName(barber.getUser().getFirstName())
                .date(date)
                .allSlots(allSlots)
                .build();
    }

    private List<ServiceInfo> mapToServiceInfo(List<SubCategory> services) {
        return services.stream()
                .map(s -> ServiceInfo.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .duration(s.getDuration())
                        .price(s.getPrice())
                        .build())
                .toList();
    }

}

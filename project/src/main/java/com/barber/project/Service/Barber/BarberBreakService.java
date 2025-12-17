package com.barber.project.Service.Barber;

import com.barber.project.Dto.Request.Barber.BarberBreakRequest;
import com.barber.project.Dto.Response.Barber.BarberBreakResponse;
import com.barber.project.Dto.Validations.BarberValidationResult;
import com.barber.project.Entity.Barber;
import com.barber.project.Entity.BarberBreak;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Client;
import com.barber.project.Repository.BarberBreakRepository;
import com.barber.project.Service.BarberShop.BarberShopService;
import com.barber.project.Service.Validations.BarberValidationService;
import com.barber.project.Service.Validations.ReservationCalculationService;
import com.barber.project.Service.Validations.SlotValidationService;
import jdk.dynalink.linker.LinkerServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberBreakService {
    private final BarberBreakRepository breakRepository;
    private final BarberValidationService barberValidationService;
    private final SlotValidationService slotValidationService;
    private final ReservationCalculationService reservationCalculationService;


    @Transactional
    public BarberBreakResponse createBreak(BarberBreakRequest request){

        if (!request.getEnd().isAfter(request.getStart())) {
            throw new IllegalArgumentException(
                    String.format("La hora de fin (%s) debe ser posterior a la hora de inicio (%s)",
                            request.getEnd(), request.getStart())
            );
        }

        //validar barbero
        BarberValidationResult validation = barberValidationService.validateAuthenticatedBarber();

        int breakDuration = (int) Duration.between(request.getStart(), request.getEnd()).toMinutes();
        int requiredBlocks = reservationCalculationService.calculateRequiredBlocks(breakDuration);

        slotValidationService.validateTimeSlot(
                validation.barber().getId(),
                validation.barberShop(),
                request.getDate(),
                request.getStart(),
                breakDuration,
                requiredBlocks
        );

        //crear el break
        BarberBreak barberBreak = new BarberBreak();
        barberBreak.setStart(request.getStart());
        barberBreak.setEnd(request.getEnd());
        barberBreak.setDate(request.getDate());
        barberBreak.setBarber(validation.barber());
        BarberBreak saved = breakRepository.save(barberBreak);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BarberBreakResponse> listBreaks(LocalDate date){

        BarberValidationResult validation = barberValidationService.validateAuthenticatedBarber();


        return breakRepository.findByBarberIdAndDate(validation.barber().getId(), date)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BarberBreakResponse mapToResponse(BarberBreak barberBreak){
        return new BarberBreakResponse(
                barberBreak.getId(),
                barberBreak.getStart(),
                barberBreak.getEnd(),
                barberBreak.getDate(),
                barberBreak.getBarber().getUser().getFirstName()

        );
    }

}

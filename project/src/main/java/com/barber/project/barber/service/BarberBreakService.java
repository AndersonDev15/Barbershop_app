package com.barber.project.barber.service;


import com.barber.project.Util.TimeUtils;
import com.barber.project.barber.dto.request.BarberBreakRequest;
import com.barber.project.barber.dto.response.BarberBreakResponse;
import com.barber.project.barber.dto.internal.BarberValidationResult;
import com.barber.project.barber.entity.BarberBreak;
import com.barber.project.barber.repository.BarberBreakRepository;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.OpeningHours;
import com.barber.project.barbershop.service.BarberShopService;
import com.barber.project.reservation.service.SlotValidationService;
import com.barber.project.shared.Exception.BadRequestException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberBreakService {
    private final BarberBreakRepository breakRepository;
    private final BarberValidationService barberValidationService;
    private final BarberShopService barberShopService;

    @Transactional
    public BarberBreakResponse createBreak(BarberBreakRequest request, String userUuid) {
        if (!request.end().isAfter(request.start())) {
            throw new BadRequestException(
                    String.format("La hora de fin (%s) debe ser posterior a la hora de inicio (%s)",
                            request.end(), request.start())
            );
        }

        BarberValidationResult validation = barberValidationService.validateAuthenticatedBarber(userUuid);

        // ✅ validar que el break esté dentro del horario de la barbería
        List<OpeningHours> hoursList = barberShopService.getOpeningHours(
                validation.barberShop(),
                request.date().getDayOfWeek()
        );

        boolean withinSchedule = hoursList.stream()
                .anyMatch(h -> !request.start().isBefore(h.getStartTime())
                        && !request.end().isAfter(h.getEndTime()));

        if (!withinSchedule) {
            throw new ValidationException("El descanso debe estar dentro del horario de atención");
        }


        if (breakRepository.existsOverlap(
                validation.barber().getId(),
                request.date(),
                request.start(),
                request.end())) {
            throw new ValidationException("El descanso se solapa con otro existente");
        }

        BarberBreak barberBreak = new BarberBreak();
        barberBreak.setStart(request.start());
        barberBreak.setEnd(request.end());
        barberBreak.setDate(request.date());
        barberBreak.setBarber(validation.barber());

        return mapToResponse(breakRepository.save(barberBreak));
    }

    @Transactional(readOnly = true)
    public List<BarberBreakResponse> listBreaks(LocalDate date, String userUuid) {
        BarberValidationResult validation = barberValidationService.validateAuthenticatedBarber(userUuid);
        return breakRepository.findByBarberIdAndDate(validation.barber().getId(), date)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<BarberBreak> getBreaks(Long barberId, LocalDate date) {
        return breakRepository.findByBarberIdAndDate(barberId, date);
    }

    public boolean existsOverlap(Long barberId, LocalDate date, LocalTime start, LocalTime end) {
        return breakRepository.existsOverlap(barberId, date, start, end);
    }

    private BarberBreakResponse mapToResponse(BarberBreak barberBreak) {
        return new BarberBreakResponse(
                barberBreak.getId(),
                barberBreak.getStart(),
                barberBreak.getEnd(),
                barberBreak.getDate(),
                barberBreak.getBarber().getUser().getFirstName()
        );
    }
}

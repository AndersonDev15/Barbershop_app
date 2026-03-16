package com.barber.project.reservation.service;

import com.barber.project.Util.TimeUtils;
import com.barber.project.barber.service.BarberBreakService;
import com.barber.project.barbershop.service.BarberShopService;
import com.barber.project.reservation.dto.response.SlotInfo;
import com.barber.project.barber.entity.BarberBreak;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.OpeningHours;
import com.barber.project.reservation.entity.Reservation;
import com.barber.project.reservation.entity.enums.ReservationStatus;
import com.barber.project.reservation.repository.ReservationRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SlotValidationService {

    private final ReservationRepository reservationRepository;
    private final BarberShopService barberShopService;
    private final BarberBreakService barberBreakService;

    private static final Set<ReservationStatus> BLOCKING_STATUSES = Set.of(
            ReservationStatus.PENDIENTE,
            ReservationStatus.CONFIRMADA,
            ReservationStatus.EN_CURSO
    );

    public List<SlotInfo> calculateAvailableSlots(
            Long barberId,
            LocalDate date,
            BarberShop barberShop,
            DayOfWeek day
    ) {

        List<OpeningHours> hoursList =
                barberShopService.getOpeningHours(barberShop, day);

        List<BarberBreak> breaks =
                barberBreakService.getBreaks(barberId, date);

        List<Reservation> reservations =
                reservationRepository.findBlockingReservations(
                        barberId,
                        date,
                        BLOCKING_STATUSES
                );

        List<SlotInfo> slots = new ArrayList<>();

        for (OpeningHours hours : hoursList) {
            generateSlotsForHours(hours, breaks, reservations, date, slots);
        }

        slots.sort(Comparator.comparing(SlotInfo::time));

        return slots;
    }

    public void validateTimeSlot(
            Long barberId,
            BarberShop barberShop,
            LocalDate date,
            LocalTime startTime,
            int totalDuration,
            int requiredBlocks
    ) {

        validateNotPastDateTime(date, startTime);

        List<OpeningHours> hoursList =
                barberShopService.getOpeningHours(
                        barberShop,
                        date.getDayOfWeek()
                );

        OpeningHours matching = hoursList.stream()
                .filter(hours ->
                        !startTime.isBefore(hours.getStartTime()) &&
                                !startTime.plusMinutes(totalDuration).isAfter(hours.getEndTime()))
                .findFirst()
                .orElseThrow(() -> new ValidationException(
                        "La hora seleccionada no entra en ningún intervalo de trabajo"
                ));

        List<Reservation> reservations =
                reservationRepository.findBlockingReservations(
                        barberId,
                        date,
                        BLOCKING_STATUSES
                );

        List<BarberBreak> breaks =
                barberBreakService.getBreaks(barberId, date);

        if (!areBlocksFree(startTime, requiredBlocks, matching.getEndTime(),
                reservations, breaks, date)) {

            throw new ValidationException("El horario ya no está disponible");
        }
    }

    public void validateNotPastDateTime(LocalDate date, LocalTime time) {

        if (LocalDateTime.of(date, time).isBefore(LocalDateTime.now())) {
            throw new ValidationException(
                    "No se pueden agendar citas en fechas/horas pasadas"
            );
        }
    }

    private boolean areBlocksFree(
            LocalTime start,
            int requiredBlocks,
            LocalTime intervalEnd,
            List<Reservation> reservations,
            List<BarberBreak> breaks,
            LocalDate date
    ) {

        LocalTime cursor = start;

        for (int i = 0; i < requiredBlocks; i++) {

            LocalTime blockStart = cursor;
            LocalTime blockEnd = cursor.plusMinutes(TimeUtils.BLOCK_MINUTES);

            if (blockEnd.isAfter(intervalEnd)) return false;

            if (date.isEqual(LocalDate.now()) &&
                    blockStart.isBefore(LocalTime.now()))
                return false;

            boolean reservationOverlap = reservations.stream()
                    .anyMatch(r ->
                            overlaps(blockStart, blockEnd,
                                    r.getStartTime(), r.getEndTime()));

            if (reservationOverlap) return false;

            boolean breakOverlap = breaks.stream()
                    .anyMatch(b ->
                            overlaps(blockStart, blockEnd,
                                    b.getStart(), b.getEnd()));

            if (breakOverlap) return false;

            cursor = cursor.plusMinutes(TimeUtils.BLOCK_MINUTES);
        }

        return true;
    }

    private void generateSlotsForHours(
            OpeningHours hours,
            List<BarberBreak> breaks,
            List<Reservation> reservations,
            LocalDate date,
            List<SlotInfo> slots
    ) {

        LocalTime cursor = hours.getStartTime();
        LocalTime intervalEnd = hours.getEndTime();

        while (!cursor.plusMinutes(TimeUtils.BLOCK_MINUTES).isAfter(intervalEnd)) {

            LocalTime slotStart = cursor;
            LocalTime slotEnd = cursor.plusMinutes(TimeUtils.BLOCK_MINUTES);

            boolean isReserved = reservations.stream()
                    .anyMatch(r -> overlaps(
                            slotStart,
                            slotEnd,
                            r.getStartTime(),
                            r.getEndTime()
                    ));

            boolean isBreak = breaks.stream()
                    .anyMatch(b -> overlaps(
                            slotStart,
                            slotEnd,
                            b.getStart(),
                            b.getEnd()
                    ));

            String status = determineStatus(slotStart, isReserved, isBreak, date);

            slots.add(new SlotInfo(slotStart, status));

            cursor = cursor.plusMinutes(TimeUtils.BLOCK_MINUTES);
        }
    }

    private boolean overlaps(
            LocalTime slotStart,
            LocalTime slotEnd,
            LocalTime otherStart,
            LocalTime otherEnd
    ) {

        if (slotEnd.equals(otherStart)) return false;
        if (otherEnd.equals(slotStart)) return false;

        return slotStart.isBefore(otherEnd)
                && otherStart.isBefore(slotEnd);
    }

    private String determineStatus(
            LocalTime slotStart,
            boolean isReserved,
            boolean isBreak,
            LocalDate date
    ) {

        if (LocalDateTime.of(date, slotStart).isBefore(LocalDateTime.now()))
            return "NO DISPONIBLE";

        if (isReserved || isBreak)
            return "OCUPADO";

        return "DISPONIBLE";
    }
}





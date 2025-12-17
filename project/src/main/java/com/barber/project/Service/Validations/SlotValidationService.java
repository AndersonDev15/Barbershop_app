package com.barber.project.Service.Validations;

import com.barber.project.Dto.Response.Reservation.SlotInfo;
import com.barber.project.Entity.BarberBreak;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.OpeningHours;
import com.barber.project.Entity.Reservation;
import com.barber.project.Entity.enums.ReservationStatus;
import com.barber.project.Repository.BarberBreakRepository;
import com.barber.project.Repository.OpeningHoursRepository;
import com.barber.project.Repository.ReservationRepository;
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
    private final BarberBreakRepository breakRepository;
    private final OpeningHoursRepository openingHoursRepository;
    private static final int BLOCK_MINUTES = 15;

    public List<SlotInfo> calculateAvailableSlots(Long barberId, LocalDate date,
                                                  BarberShop barberShop, DayOfWeek day) {

        List<OpeningHours> hoursList = openingHoursRepository
                .findByBarberShopAndDayOfWeek(barberShop, day);

        List<BarberBreak> breaks = breakRepository
                .findByBarberIdAndDate(barberId, date);

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

        slots.sort(Comparator.comparing(SlotInfo::getTime));
        return slots;
    }

    private void generateSlotsForHours(OpeningHours hours, List<BarberBreak> breaks,
                                       List<Reservation> reservations, LocalDate date,
                                       List<SlotInfo> slots) {

        LocalTime cursor = hours.getStartTime();
        LocalTime intervalEnd = hours.getEndTime();

        while (!cursor.plusMinutes(BLOCK_MINUTES).isAfter(intervalEnd)) {
            LocalTime slotStart = cursor;
            LocalTime slotEnd = cursor.plusMinutes(BLOCK_MINUTES);

            boolean isReserved = hasReservationOverlap(reservations, slotStart, slotEnd);
            boolean isBreak = hasBreakOverlap(breaks, slotStart, slotEnd);

            String status = determineStatus(slotStart, isReserved, isBreak, date);

            slots.add(SlotInfo.builder()
                    .time(slotStart)
                    .status(status)
                    .build());

            cursor = cursor.plusMinutes(BLOCK_MINUTES);
        }
    }

    private boolean hasReservationOverlap(List<Reservation> reservations,
                                          LocalTime slotStart, LocalTime slotEnd) {
        return reservations.stream()
                .anyMatch(r -> overlaps(slotStart, slotEnd, r.getStartTime(), r.getEndTime()));
    }

    public void validateTimeSlot(Long barberId, BarberShop barberShop, LocalDate date,
                                 LocalTime startTime, int totalDuration, int requiredBlocks) {

        validateNotPastDateTime(date, startTime);
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        // 1. Obtener horarios laborales
        List<OpeningHours> hoursList = openingHoursRepository.findByBarberShopAndDayOfWeek(barberShop, dayOfWeek);

        // 2. Validar que la hora esté dentro del horario laboral
        OpeningHours matching = hoursList.stream()
                .filter(hours -> !startTime.isBefore(hours.getStartTime()) &&
                        !startTime.plusMinutes(totalDuration).isAfter(hours.getEndTime()))
                .findFirst()
                .orElseThrow(() -> new ValidationException("La hora seleccionada no entra en ningún intervalo de trabajo"));

        // 3. Validar disponibilidad
        boolean available = areConsecutiveBlocksFree(
                barberId,
                date,
                startTime,
                requiredBlocks,
                matching.getEndTime()
        );

        if (!available) {
            throw new ValidationException("El horario ya no está disponible");
        }
    }

    public void validateNotPastDateTime(LocalDate date, LocalTime time) {
        LocalDateTime dateTime = LocalDateTime.of(date, time);

        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new ValidationException(
                    String.format("No se pueden agendar citas en fechas/horas pasadas. Fecha/hora recibida: %s %s",
                            date, time)
            );
        }
    }

    private boolean hasBreakOverlap(List<BarberBreak> breaks,
                                    LocalTime slotStart, LocalTime slotEnd) {
        return breaks.stream()
                .anyMatch(b -> overlaps(slotStart, slotEnd, b.getStart(), b.getEnd()));
    }

    private boolean overlaps(LocalTime slotStart, LocalTime slotEnd,
                             LocalTime otherStart, LocalTime otherEnd) {
        if (slotEnd.equals(otherStart)) return false;
        if (otherEnd.equals(slotStart)) return false;
        return slotStart.isBefore(otherEnd) && otherStart.isBefore(slotEnd);
    }

    private String determineStatus(LocalTime slotStart, boolean isReserved,
                                   boolean isBreak, LocalDate date) {
        if (LocalDateTime.of(date, slotStart).isBefore(LocalDateTime.now())) {
            return "NO DISPONIBLE";
        }
        if (isReserved || isBreak) {
            return "OCUPADO";
        }
        return "DISPONIBLE";
    }

    //validar el tiempo requerido este disponible
    public boolean areConsecutiveBlocksFree(Long barberId, LocalDate date, LocalTime start, int requiredBlocks, LocalTime intervalEnd) {
        LocalTime cursor = start;
        for (int i= 0;i<requiredBlocks; i++){
            LocalTime blockStart = cursor;
            LocalTime blockEnd = cursor.plusMinutes(BLOCK_MINUTES);

            //no pasarse del horario
            if(blockEnd.isAfter(intervalEnd))return false;

            //una hora pasada
            if(date.isEqual(LocalDate.now()) && blockStart.isBefore(LocalTime.now())) return false;

            //solapamiento en reservas
            if (reservationRepository.existsOverlap(
                    barberId,
                    date,
                    blockStart,
                    blockEnd,
                    BLOCKING_STATUSES
            )) return false;

            //solapamiento en descansos
            if(breakRepository.existsOverlap(barberId,date,blockStart,blockEnd)) return  false;

            cursor = cursor.plusMinutes(BLOCK_MINUTES);

        }
        return true;
    }
    private static final Set<ReservationStatus> BLOCKING_STATUSES =
            Set.of(
                    ReservationStatus.PENDIENTE,
                    ReservationStatus.CONFIRMADA,
                    ReservationStatus.EN_CURSO
            );
}






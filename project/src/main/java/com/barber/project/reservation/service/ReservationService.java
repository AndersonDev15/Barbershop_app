package com.barber.project.reservation.service;


import com.barber.project.barber.entity.Barber;
import com.barber.project.barbershop.entity.SubCategory;
import com.barber.project.barbershop.service.SubCategoryService;
import com.barber.project.client.entity.Client;
import com.barber.project.reservation.dto.request.ReservationRequest;
import com.barber.project.barber.dto.internal.BarberValidationResult;
import com.barber.project.reservation.dto.internal.ServiceCalculationResult;
import com.barber.project.reservation.entity.enums.ReservationStatus;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.infrastructure.email.EmailService;
import com.barber.project.barber.service.BarberService;
import com.barber.project.client.service.ClientService;
import com.barber.project.barber.service.BarberValidationService;
import com.barber.project.reservation.dto.internal.CancellationEmailData;
import com.barber.project.reservation.dto.internal.ReservationEmailData;
import com.barber.project.reservation.dto.response.ReservationResponse;
import com.barber.project.reservation.dto.response.ServiceInfo;
import com.barber.project.reservation.entity.Reservation;
import com.barber.project.reservation.entity.ReservationItem;
import com.barber.project.reservation.repository.ReservationRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final BarberService barberService;
    private final ClientService clientService;
    private final ReservationCalculationService reservationCalculationService;
    private final BarberValidationService barberValidationService;
    private final SlotValidationService slotValidationService;
    private final EmailService emailService;
    private final ReservationRepository reservationRepository;
    private final SubCategoryService subCategoryService;

    private static final int MIN_CANCELLATION_MINUTES = 15;

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request, String userUuid) {

        if (request.subcategoryIds() == null || request.subcategoryIds().isEmpty()) {
            throw new ValidationException("Debes seleccionar al menos un servicio");
        }

        BarberValidationResult validation =
                barberValidationService.validateBarberAndShop(request.barberId());

        Client client = clientService.getClientByUserUuid(userUuid);

        ServiceCalculationResult calculation =
                reservationCalculationService.calculateServices(request.subcategoryIds());

        slotValidationService.validateTimeSlot(
                validation.barber().getId(),
                validation.barberShop(),
                request.date(),
                request.startTime(),
                calculation.totalDuration(),
                calculation.requiredBlocks()
        );

        Reservation reservation =
                buildReservation(validation.barber(), client, request, calculation);

        Reservation saved = reservationRepository.save(reservation);

        sendNewReservationNotifications(saved, calculation.services());

        return mapToResponse(saved, calculation.services());
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> listReservations(LocalDate date, String userUuid) {

        Barber barber = barberService.getBarberByUserUuid(userUuid);

        List<Reservation> reservations =
                reservationRepository.findByBarberIdAndDateOrderByStartTimeAsc(
                        barber.getId(), date
                );

        return mapToResponseList(reservations);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getMyTodayReservations(String userUuid) {

        Barber barber = barberService.getBarberByUserUuid(userUuid);

        List<Reservation> reservations =
                reservationRepository.findByBarberIdAndDateOrderByStartTimeAsc(
                        barber.getId(), LocalDate.now()
                );

        return mapToResponseList(reservations);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getMyClientReservations(
            ReservationStatus status,
            String userUuid
    ) {

        Client client = clientService.getClientByUserUuid(userUuid);

        List<Reservation> reservations =
                status != null
                        ? reservationRepository.findByClientIdAndStatusOrderByDateDescTimeDesc(
                        client.getId(), status)
                        : reservationRepository.findByClientIdOrderByDateDescTimeDesc(
                        client.getId());

        return mapToResponseList(reservations);
    }

    @Transactional
    public ReservationResponse cancelReservation(Long reservationId, String userUuid) {

        Client client = clientService.getClientByUserUuid(userUuid);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reservación no encontrada"));

        if (!reservation.getClient().getId().equals(client.getId())) {
            throw new ValidationException(
                    "No puedes cancelar una reservación que no te pertenece"
            );
        }

        if (reservation.getStatus() == ReservationStatus.CANCELADA) {
            throw new ValidationException("La reserva ya está cancelada");
        }

        validateCancellationTime(reservation.getDate(), reservation.getStartTime());

        ReservationStatus oldStatus = reservation.getStatus();

        reservation.setStatus(ReservationStatus.CANCELADA);

        Reservation saved = reservationRepository.save(reservation);

        List<ServiceInfo> services = getServicesFromReservation(saved);

        sendCancellationNotifications(saved, oldStatus);

        return mapToResponse(saved, services);
    }

    @Transactional
    public ReservationResponse changeReservationStatus(
            Long reservationId,
            ReservationStatus newStatus,
            String userUuid
    ) {

        Barber barber = barberService.getBarberByUserUuid(userUuid);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reserva no encontrada"));

        if (!reservation.getBarber().getId().equals(barber.getId())) {
            throw new ValidationException(
                    "No puedes cambiar el estado de una reserva que no es tuya"
            );
        }

        if (reservation.getStatus() == ReservationStatus.CANCELADA) {
            throw new ValidationException(
                    "No se puede cambiar el estado de una reserva cancelada"
            );
        }

        ReservationStatus oldStatus = reservation.getStatus();

        validateStatusTransition(oldStatus, newStatus);

        reservation.setStatus(newStatus);

        Reservation saved = reservationRepository.save(reservation);

        List<ServiceInfo> services = getServicesFromReservation(saved);

        sendStatusChangeEmail(saved, oldStatus, newStatus, services);

        return mapToResponse(saved, services);
    }

    @Transactional(readOnly = true)
    public List<Reservation> findReservationsStartingIn20Minutes() {

        LocalTime now = LocalTime.now().withSecond(0).withNano(0);

        return reservationRepository.findReservationsStartingBetween(
                LocalDate.now(),
                now.plusMinutes(18),
                now.plusMinutes(22)
        );
    }

    // ── Helpers ─────────────────────────────────────

    @Transactional(readOnly = true)
    public Reservation getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));
    }

    public Duration calculateDuration(Reservation reservation) {
        if (reservation.getStartTime() == null || reservation.getEndTime() == null) {
            return Duration.ZERO;
        }
        return Duration.between(reservation.getStartTime(), reservation.getEndTime());
    }


    private Reservation buildReservation(
            Barber barber,
            Client client,
            ReservationRequest request,
            ServiceCalculationResult calculation
    ) {

        Reservation reservation = Reservation.builder()
                .barber(barber)
                .client(client)
                .date(request.date())
                .startTime(request.startTime())
                .endTime(request.startTime().plusMinutes(calculation.totalDuration()))
                .finalPrice(calculation.totalPrice())
                .status(ReservationStatus.CONFIRMADA)
                .build();

        calculation.subcategoryIds().forEach(reservation::addService);

        return reservation;
    }

    private List<ServiceInfo> getServicesFromReservation(Reservation reservation) {

        List<Long> subcategoryIds = reservation.getItems().stream()
                .map(ReservationItem::getSubcategoryId)
                .toList();

        return subCategoryService.findAllById(subcategoryIds)
                .stream()
                .map(s -> new ServiceInfo(
                        s.getId(),
                        s.getName(),
                        s.getDuration(),
                        s.getPrice()
                ))
                .toList();
    }

    private Map<Long, List<ServiceInfo>> getServicesForReservations(
            List<Reservation> reservations
    ) {

        List<Long> reservationIds = reservations.stream()
                .map(Reservation::getId)
                .toList();

        List<SubCategory> subcategories =
                subCategoryService.findByReservationIds(reservationIds);

        Map<Long, ServiceInfo> serviceMap = subcategories.stream()
                .collect(Collectors.toMap(
                        SubCategory::getId,
                        s -> new ServiceInfo(
                                s.getId(),
                                s.getName(),
                                s.getDuration(),
                                s.getPrice()
                        )
                ));

        return reservations.stream()
                .collect(Collectors.toMap(
                        Reservation::getId,
                        r -> r.getItems().stream()
                                .map(item -> serviceMap.get(item.getSubcategoryId()))
                                .filter(Objects::nonNull)
                                .toList()
                ));
    }

    private List<ReservationResponse> mapToResponseList(
            List<Reservation> reservations
    ) {

        if (reservations.isEmpty()) return List.of();

        Map<Long, List<ServiceInfo>> servicesMap =
                getServicesForReservations(reservations);

        return reservations.stream()
                .map(r -> mapToResponse(
                        r,
                        servicesMap.getOrDefault(r.getId(), List.of())
                ))
                .toList();
    }

    private void sendNewReservationNotifications(
            Reservation reservation,
            List<ServiceInfo> services
    ) {

        ReservationEmailData data = buildEmailData(reservation, services);

        emailService.sendNewReservationToBarber(data);
        emailService.sendReservationConfirmationToClient(data);
    }

    private void sendStatusChangeEmail(
            Reservation reservation,
            ReservationStatus oldStatus,
            ReservationStatus newStatus,
            List<ServiceInfo> services
    ) {

        if (oldStatus != newStatus) {

            ReservationEmailData data =
                    buildEmailData(reservation, services);

            emailService.sendStatusChangeNotification(
                    data,
                    oldStatus,
                    newStatus
            );
        }
    }

    private void sendCancellationNotifications(
            Reservation reservation,
            ReservationStatus oldStatus
    ) {

        CancellationEmailData data =
                buildCancellationEmailData(reservation, oldStatus);

        emailService.sendReservationCancellBarber(data);
        emailService.sendReservationCancelClient(data);
    }

    private void validateCancellationTime(LocalDate date, LocalTime startTime) {

        LocalDateTime reservationDateTime = LocalDateTime.of(date, startTime);

        LocalDateTime now = LocalDateTime.now();

        if (reservationDateTime.isBefore(now)) {
            throw new ValidationException("La reserva ya ocurrió");
        }

        long minutesUntilReservation =
                Duration.between(now, reservationDateTime).toMinutes();

        if (minutesUntilReservation < MIN_CANCELLATION_MINUTES) {

            throw new ValidationException(String.format(
                    "Solo se pueden cancelar reservas con al menos %d minutos de anticipación. Faltan %d minutos.",
                    MIN_CANCELLATION_MINUTES,
                    minutesUntilReservation
            ));
        }
    }

    private void validateStatusTransition(
            ReservationStatus currentStatus,
            ReservationStatus newStatus
    ) {

        switch (currentStatus) {

            case CONFIRMADA -> {
                if (newStatus != ReservationStatus.EN_CURSO &&
                        newStatus != ReservationStatus.CANCELADA)
                    throw new ValidationException(
                            "Estados válidos desde CONFIRMADA: EN_CURSO, CANCELADA"
                    );
            }

            case EN_CURSO -> {
                if (newStatus != ReservationStatus.COMPLETADA &&
                        newStatus != ReservationStatus.CANCELADA)
                    throw new ValidationException(
                            "Estados válidos desde EN_CURSO: COMPLETADA, CANCELADA"
                    );
            }

            case COMPLETADA ->
                    throw new ValidationException(
                            "Una reserva COMPLETADA no puede cambiar de estado"
                    );

            case CANCELADA ->
                    throw new ValidationException(
                            "Una reserva CANCELADA no puede cambiar de estado"
                    );

            default ->
                    throw new ValidationException(
                            "Estado no reconocido: " + currentStatus
                    );
        }
    }

    private ReservationEmailData buildEmailData(
            Reservation reservation,
            List<ServiceInfo> services
    ) {

        return new ReservationEmailData(
                reservation.getId(),
                reservation.getClient().getUser().getFirstName(),
                reservation.getClient().getUser().getEmail(),
                reservation.getClient().getUser().getPhone(),
                reservation.getBarber().getUser().getFirstName() + " "
                        + reservation.getBarber().getUser().getLastName(),
                reservation.getBarber().getUser().getEmail(),
                reservation.getBarber().getBarberShop().getName(),
                reservation.getBarber().getBarberShop().getAddress(),
                reservation.getDate(),
                reservation.getStartTime(),
                reservation.getFinalPrice(),
                services.stream().mapToInt(ServiceInfo::duration).sum(),
                services
        );
    }

    private CancellationEmailData buildCancellationEmailData(
            Reservation reservation,
            ReservationStatus oldStatus
    ) {

        return new CancellationEmailData(
                reservation.getId(),
                reservation.getClient().getUser().getFirstName(),
                reservation.getClient().getUser().getEmail(),
                reservation.getBarber().getUser().getFirstName() + " "
                        + reservation.getBarber().getUser().getLastName(),
                reservation.getBarber().getUser().getEmail(),
                reservation.getDate(),
                reservation.getStartTime(),
                oldStatus
        );
    }

    private ReservationResponse mapToResponse(
            Reservation reservation,
            List<ServiceInfo> services
    ) {

        return new ReservationResponse(
                reservation.getId(),
                reservation.getBarber().getUser().getFirstName(),
                reservation.getClient().getUser().getFirstName(),
                services,
                reservation.getDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getFinalPrice(),
                reservation.getStatus()
        );
    }
}
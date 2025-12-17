package com.barber.project.Service.Reservation;

import com.barber.project.Dto.Request.Reservation.ReservationRequest;
import com.barber.project.Dto.Response.Reservation.*;
import com.barber.project.Dto.Validations.BarberValidationResult;
import com.barber.project.Dto.Validations.ServiceCalculationResult;
import com.barber.project.Entity.*;
import com.barber.project.Entity.enums.ReservationStatus;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.*;
import com.barber.project.Service.Auth.EmailService;
import com.barber.project.Service.Barber.BarberService;
import com.barber.project.Service.Clients.ClientService;
import com.barber.project.Service.Validations.BarberValidationService;
import com.barber.project.Service.Validations.ReservationCalculationService;
import com.barber.project.Service.Validations.SlotValidationService;
import com.barber.project.Util.ServiceMapper;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;
import java.util.concurrent.CompletableFuture;

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
    private static final int BLOCK_MINUTES = 15;
    private static final int MIN_CANCELLATION_MINUTES = 15;

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request){

        //validar barbero
        BarberValidationResult validation = barberValidationService.validateBarberAndShop(request.getBarberId());

        //cliente
        Client client = clientService.getAuthenticatedClient();

        ServiceCalculationResult calculation = reservationCalculationService.calculateServices(request.getSubcategoryIds());

        // Validar que la hora esté dentro del horario laboral
        slotValidationService.validateTimeSlot(
                validation.barber().getId(),
                validation.barberShop(),
                request.getDate(),
                request.getStartTime(),
                calculation.totalDuration(),
                calculation.requiredBlocks()
        );

        // Crear reservación
        Reservation reservation = buildReservation(validation.barber(), client, request, calculation);
        Reservation saved = reservationRepository.save(reservation);



        //enviar email
        sendNewReservationNotifications(saved,calculation);

        return mapToResponse(saved);
    }

    // listar reservacion: barbero
    @Transactional(readOnly = true)
    public List<ReservationResponse> listReservation(LocalDate date){
        Barber barber = barberService.getAuthenticatedBarber();
        List<Reservation> reservations = reservationRepository
                .findByBarberIdAndDateOrderByStartTimeAsc(barber.getId(),date);

        return reservations.stream()
                .map(this::mapToResponse)
                .toList();

    }

    //listar las de hoy: barbero
    @Transactional(readOnly = true)
    public List<ReservationResponse> getMyTodayReservations() {
        Barber barber = barberService.getAuthenticatedBarber();
        LocalDate today = LocalDate.now();

        List<Reservation> reservations = reservationRepository
                .findByBarberIdAndDateOrderByStartTimeAsc(barber.getId(), today);

        return reservations.stream()
                .map(this::mapToResponse)
                .toList();
    }


    //clientes
    @Transactional(readOnly = true)
    public List<ReservationResponse> getMyClientReservations(ReservationStatus status) {
        Client client = clientService.getAuthenticatedClient();
        List<Reservation> reservations;

        if (status != null) {
            // Filtro por estado
            reservations = reservationRepository
                    .findByClientIdAndStatusOrderByDateDescTimeDesc(client.getId(), status);
        } else {
            // Todas las reservas
            reservations = reservationRepository
                    .findByClientIdOrderByDateDescTimeDesc(client.getId());
        }

        return reservations.stream()
                .map(this::mapToResponse)
                .toList();
    }

    //cancelacion
    @Transactional
    public ReservationResponse CancellReservation(Long reservationId){
        Client client = clientService.getAuthenticatedClient();
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(()->new ResourceNotFoundException("Reservacion no encontrada"));

        if(!reservation.getClient().getId().equals(client.getId())){
            throw new ValidationException("No puedes cancelar una Reservacion que no te pertenece");
        }

        if(reservation.getStatus()==ReservationStatus.CANCELADA){
            throw new ValidationException("La reserva ya esta cancelada");
        }

        validateCancellationTime(reservation.getDate(),reservation.getStartTime());

        ReservationStatus oldStatus = reservation.getStatus();
        reservation.setStatus(ReservationStatus.CANCELADA);
        Reservation saved = reservationRepository.save(reservation);

        //enviar email
        sendCancellationNotifications(saved,oldStatus);
        return mapToResponse(saved);

    }

    //barbero cambia el estado en curso -> completado
    @Transactional
    public ReservationResponse changeReservationStatus(Long reservationId,ReservationStatus newStatus){
        Barber barber = barberService.getAuthenticatedBarber();
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(()->new ResourceNotFoundException("Reserva no encontrada"));

        //guardar estado anterior
        ReservationStatus oldStatus = reservation.getStatus();
        //validar que la reserva sea del barbero
        if(!reservation.getBarber().getId().equals(barber.getId())){
            throw new ValidationException("No puedes cambiar el estado de una reserva que no es tuya");
        }
        // Validar que no esté cancelada
        if (reservation.getStatus() == ReservationStatus.CANCELADA) {
            throw new ValidationException("No se puede cambiar el estado de una reserva cancelada");
        }

        validateStatusTransition(reservation.getStatus(),newStatus);
        //cambiar estado
        reservation.setStatus(newStatus);
        Reservation saved = reservationRepository.save(reservation);

        // Obtener servicios directamente desde la reserva


        //enviar email
       sendStatusChangeEmail(saved,oldStatus,newStatus);
        return mapToResponse(saved);

    }

    private void sendNewReservationNotifications(Reservation reservation, ServiceCalculationResult calculation) {

        ReservationEmailData data = buildEmailData(reservation,calculation);

        CompletableFuture<Void> barberEmail = CompletableFuture.runAsync(()->{
            try {
                emailService.sendNewReservationToBarber(data);
                System.out.println("Email enviado al barbero");
            } catch (Exception e) {
                System.err.println("Error email barbero: " + e.getMessage());
            }
        });
        CompletableFuture<Void> clientEmail = CompletableFuture.runAsync(()->{
            try {
                emailService.sendReservationConfirmationToClient(data);
                System.out.println("Email Enviado al client");
            }catch (Exception e){
                System.out.println("Error al enviar correo al cliente" + e.getMessage());
            }
        });
        CompletableFuture.allOf(barberEmail,clientEmail)
                .exceptionally(throwable -> {
                    System.out.println("Error en algun email para reserva # " + reservation.getId() );
                    return null;
                });
    }

    private ReservationEmailData buildEmailData(Reservation reservation,ServiceCalculationResult calculation) {
       List<ServiceInfo> services = mapServicesToInfo(calculation.services());
       return new ReservationEmailData(
               reservation.getId(),
               reservation.getClient().getUser().getFirstName(),
               reservation.getClient().getUser().getEmail(),
               reservation.getClient().getUser().getPhone(),
               reservation.getBarber().getUser().getFirstName() + " " + reservation.getBarber().getUser().getLastName(),
               reservation.getBarber().getUser().getEmail(),
               reservation.getBarber().getBarberShop().getName(),
               reservation.getBarber().getBarberShop().getAddress(),
               reservation.getDate(),
               reservation.getStartTime(),
               calculation.totalPrice(),
               calculation.totalDuration(),
               services
       );
    }


    private List<ServiceInfo> mapServicesToInfo(List<SubCategory> services) {
        return services.stream()
                .map(s -> ServiceInfo.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .duration(s.getDuration())
                        .price(s.getPrice())
                        .build()
                ).toList();
    }

    private void sendStatusChangeEmail(Reservation reservation,
                                       ReservationStatus oldStatus,
                                       ReservationStatus newStatus
                                       ){
        if(oldStatus!=newStatus){
            ServiceCalculationResult calculation =
                    reservationCalculationService.calculateServices(
                            reservation.getServices()
                                    .stream()
                                    .map(SubCategory::getId)
                                    .toList()
                    );
            ReservationEmailData data = buildEmailData(reservation,calculation);
            CompletableFuture.runAsync(()->{
                try {
                    emailService.sendStatusChangeNotification(data,oldStatus,newStatus);

                    System.out.println("Email de cambio de estado enviado para reserva #" + reservation.getId());
                }catch (Exception e){
                    System.err.println("Error enviando email de cambio de estado para reserva #" + reservation.getId());
                    System.err.println("Error: " + e.getMessage());

                }
            });
        }
    }

    private void sendCancellationNotifications(Reservation reservation, ReservationStatus oldStatus) {

        CancellationEmailData data = buildCancellationEmailData(reservation,oldStatus);


        CompletableFuture<Void> barberEmail = CompletableFuture.runAsync(() -> {
            try {
                emailService.sendReservationCancellBarber(data);
            } catch (Exception e) {
                System.err.println("Error enviando email de cancelación al barbero: " + e.getMessage());
            }
        });

        CompletableFuture<Void> clientEmail = CompletableFuture.runAsync(() -> {
            try {
                emailService.sendReservationCancelClient(data);
            } catch (Exception e) {
                System.err.println("Error enviando email de cancelación al cliente: " + e.getMessage());
            }
        });

        CompletableFuture.allOf(barberEmail, clientEmail)
                .exceptionally(ex -> {
                    System.err.println("Error en algún envío de cancelación.");
                    return null;
                });
    }

    private CancellationEmailData buildCancellationEmailData(Reservation reservation, ReservationStatus oldStatus){
        return new CancellationEmailData(
                reservation.getId(),
                reservation.getClient().getUser().getFirstName(),
                reservation.getClient().getUser().getEmail(),
                reservation.getBarber().getUser().getFirstName()  + " " +
                        reservation.getBarber().getUser().getLastName(),
                reservation.getBarber().getUser().getEmail(),
                reservation.getDate(),
                reservation.getStartTime(),
                oldStatus
        );
    }

    // crear la reservacion
    private Reservation buildReservation(Barber barber, Client client,
                                         ReservationRequest request,
                                         ServiceCalculationResult calculation) {
        return Reservation.builder()
                .barber(barber)
                .client(client)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getStartTime().plusMinutes(calculation.totalDuration()))
                .finalPrice(calculation.totalPrice())
                .status(ReservationStatus.CONFIRMADA)
                .services(calculation.services())
                .build();
    }


    //tiempo de cancelacion
    private void validateCancellationTime(LocalDate date,LocalTime startTime){
        LocalDateTime reservationDateTime = LocalDateTime.of(date,startTime);
        LocalDateTime now = LocalDateTime.now();

        // calculo del tiempo restante antes de la reserva
        long minutesUntilReservation = Duration.between(now,reservationDateTime).toMinutes();

        if(minutesUntilReservation<15){
            throw new ValidationException( String.format("Solo se pueden cancelar reservas con al menos %d minutos de anticipación. " +
                    "Faltan %d minutos para la reserva.", MIN_CANCELLATION_MINUTES, minutesUntilReservation));
        }
    }

    //inicio en 20 minutos
    public List<Reservation> findReservationsStartingIn20Minutes() {
        return reservationRepository.findReservationsStartingAt(
                LocalDate.now(),
                LocalTime.now().plusMinutes(20).withSecond(0).withNano(0)
        );
    }

    //transicion de estado
    private void validateStatusTransition(ReservationStatus currentStatus,ReservationStatus newStatus){
        //estados validos
        switch (currentStatus){
            case CONFIRMADA:
                if(newStatus!=ReservationStatus.EN_CURSO && newStatus!=ReservationStatus.CANCELADA){
                    throw new ValidationException(
                            String.format("No se puede cambiar de %s a %s. Estados válidos: EN_CURSO, CANCELADA",
                                    currentStatus, newStatus)
                    );
                }
                break;
            case EN_CURSO:
                if (newStatus != ReservationStatus.COMPLETADA && newStatus != ReservationStatus.CANCELADA) {
                    throw new ValidationException(
                            String.format("No se puede cambiar de %s a %s. Estados válidos: COMPLETADA, CANCELADA",
                                    currentStatus, newStatus)
                    );
                }
                break;
            case COMPLETADA:
                throw new ValidationException("Una reserva COMPLETADA no puede cambiar de estado");
            case CANCELADA:
                throw new ValidationException("Una reserva CANCELADA no puede cambiar de estado");
            default:
                throw new ValidationException("Estado de reserva no reconocido: " + currentStatus);
        }
    }

    public Duration calculateDuration(Reservation reservation) {
        if (reservation.getStartTime() == null || reservation.getEndTime() == null) {
            return Duration.ZERO;
        }
        return Duration.between(
                reservation.getStartTime(),
                reservation.getEndTime()
        );
    }
    //respuesta
    private ReservationResponse mapToResponse(Reservation reservation) {

        // Mapear servicios
        List<ServiceInfo> serviceInfos = ServiceMapper.mapToServiceInfo(
                reservation.getServices());
        return ReservationResponse.builder()
                .id(reservation.getId())
                .barber(reservation.getBarber().getUser().getFirstName())
                .client(reservation.getClient().getUser().getFirstName())
                .services(serviceInfos)
                .date(reservation.getDate())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .totalPrice(reservation.getFinalPrice())
                .status(reservation.getStatus())
                .build();
    }
}
package com.barber.project.transaction.service;



import com.barber.project.barber.entity.Barber;
import com.barber.project.barbershop.service.SubCategoryService;
import com.barber.project.reservation.entity.Reservation;
import com.barber.project.reservation.entity.ReservationItem;
import com.barber.project.reservation.service.ReservationService;
import com.barber.project.transaction.dto.request.TransactionRequest;
import com.barber.project.reservation.dto.response.ServiceInfo;
import com.barber.project.transaction.dto.internal.TransactionEmailData;
import com.barber.project.transaction.dto.response.TransactionResponse;
import com.barber.project.transaction.entity.enums.PaymentStatus;
import com.barber.project.reservation.entity.enums.ReservationStatus;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.transaction.entity.Transaction;
import com.barber.project.transaction.repository.TransactionRepository;
import com.barber.project.infrastructure.email.EmailService;
import com.barber.project.barber.service.BarberService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BarberShopIncomeService incomeService;
    private final EmailService emailService;
    private final BarberService barberService;
    private final ReservationService reservationService;
    private final SubCategoryService subCategoryService;

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, String userUuid){
        Reservation reservation = reservationService.getReservationById(request.reservationId());


        //validar estado
        if(!reservation.getStatus().equals(ReservationStatus.COMPLETADA)){
            throw new ValidationException("La reserva debe estar completada");
        }
        //sin transaccion previa
        if(reservation.getTransaction()!=null){
            throw new ValidationException("La reserva ya tiene una transaccion");
        }

        //barbero
        Barber barber = reservation.getBarber();

        if(request.totalAmount().compareTo(reservation.getFinalPrice()) <0 ){
            throw new ValidationException("El monto pagado no puede ser menor al precio del servicio");
        }


        BigDecimal tip = request.tip() != null ? request.tip() : BigDecimal.ZERO;

        if (tip.compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("La propina no puede ser negativa");
        }

        //precio
        BigDecimal commission = reservation.getFinalPrice().multiply(barber.getCommission());
        BigDecimal barberAmount = commission.add(tip);


        //Crear Transaccion
        Transaction transaction = buildTransaction(reservation, barber, request, commission, barberAmount, tip);
        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);

    }

    @Transactional
    public TransactionResponse completeTransaction(Long TransactionId){
        Transaction transaction = transactionRepository.findById(TransactionId)
                .orElseThrow(()->new ResourceNotFoundException("Transaccion no encontrada"));

        if(!transaction.getPaymentStatus().equals(PaymentStatus.PENDIENTE)){
            throw new ValidationException("Esta transaccion ya fue procesada");
        }

        if (transaction.getPaymentMethod() == null) {
            throw new ValidationException("La transacción no tiene método de pago registrado");
        }

        //cambiar estado
        transaction.setPaymentStatus(PaymentStatus.PAGADO);
        transaction.setPaymentDate(LocalDateTime.now());
        transactionRepository.save(transaction);

        //crear ingreso barberia
        incomeService.createIncome(transaction);
        //enviar email
        sendTransactionNotifications(transaction);

        return mapToResponse(transaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> listTodayTransactions(String userUuid){
        Barber barber = barberService.getBarberByUserUuid(userUuid);
        return transactionRepository.findTodayTransactionsByBarber(barber.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();

    }


    // --- helpers ------

    @Transactional(readOnly = true)
    public List<Transaction> findCompletedByBarberAndDateRange(
            Long barberId, LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findCompletedByBarberAndDateRange(barberId, start, end);
    }

    private void sendTransactionNotifications(Transaction transaction) {
        TransactionEmailData data = buildTransactionEmailData(transaction);
        emailService.sendTransactionConfirmationToClient(data);
        emailService.sendTransactionNotificationToBarber(data);
        emailService.sendTransactionNotificationToBarberShop(data);
    }

    private Transaction buildTransaction(Reservation reservation, Barber barber,
                                         TransactionRequest request,
                                         BigDecimal commission, BigDecimal barberAmount,
                                         BigDecimal tip) {
        return Transaction.builder()
                .reservation(reservation)
                .barber(barber)
                .totalAmount(request.totalAmount())
                .barberCommission(commission)
                .barberAmount(barberAmount)
                .tip(tip)
                .paymentMethod(request.paymentMethod())
                .paymentStatus(PaymentStatus.PENDIENTE)
                .transactionCode(generateTransactionCode())
                .paymentDate(LocalDateTime.now())
                .notes(request.notes())
                .build();
    }

    private TransactionEmailData buildTransactionEmailData(Transaction transaction) {
        Reservation reservation = transaction.getReservation();

        List<Long> subcategoryIds = reservation.getItems().stream()
                .map(ReservationItem::getSubcategoryId)
                .toList();

        List<ServiceInfo> services = subCategoryService.findAllById(subcategoryIds)
                .stream()
                .map(s -> new ServiceInfo(s.getId(), s.getName(), s.getDuration(), s.getPrice()))
                .toList();

        return new TransactionEmailData(
                transaction.getId(),
                transaction.getTransactionCode(),
                transaction.getPaymentDate(),
                transaction.getTotalAmount(),
                transaction.getTip(),
                transaction.getBarberCommission(),
                transaction.getTotalAmount().subtract(transaction.getBarberCommission()),
                transaction.getPaymentMethod(),
                reservation.getClient().getUser().getFirstName() + " " + reservation.getClient().getUser().getLastName(),
                reservation.getClient().getUser().getEmail(),
                reservation.getClient().getUser().getPhone(),
                transaction.getBarber().getUser().getFirstName() + " " + transaction.getBarber().getUser().getLastName(),
                transaction.getBarber().getUser().getEmail(),
                transaction.getBarber().getBarberShop().getName(),
                transaction.getBarber().getBarberShop().getUser().getEmail(),
                transaction.getBarber().getBarberShop().getAddress(),
                transaction.getBarber().getBarberShop().getPhone(),
                reservation.getId(),
                reservation.getDate(),
                reservation.getStartTime(),
                services
        );
    }

    private TransactionResponse mapToResponse(Transaction transaction){
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionCode(transaction.getTransactionCode())
                .reservationId(transaction.getReservation().getId())
                .barberId(transaction.getBarber().getId())
                .totalAmount(transaction.getTotalAmount())
                .tip(transaction.getTip())
                .paymentMethod(transaction.getPaymentMethod())
                .paymentStatus(transaction.getPaymentStatus())
                .paymentDate(transaction.getPaymentDate())
                .notes(transaction.getNotes())
                .build();
    }

    private String generateTransactionCode() {

        String uuidPart = UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase();

        return "TRX-" + uuidPart;
    }





}

package com.barber.project.Service.Transaction;


import com.barber.project.Dto.Request.Transaction.TransactionRequest;
import com.barber.project.Dto.Response.Reservation.ServiceInfo;
import com.barber.project.Dto.Response.Transaction.TransactionEmailData;
import com.barber.project.Dto.Response.Transaction.TransactionResponse;
import com.barber.project.Entity.*;
import com.barber.project.Entity.enums.PaymentStatus;
import com.barber.project.Entity.enums.ReservationStatus;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberRepository;
import com.barber.project.Repository.BarberShopIncomeRepository;
import com.barber.project.Repository.ReservationRepository;
import com.barber.project.Repository.TransactionRepository;
import com.barber.project.Service.Auth.EmailService;
import com.barber.project.Service.Barber.BarberService;
import com.barber.project.Util.ServiceMapper;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);
    private final TransactionRepository transactionRepository;
    private final BarberRepository barberRepository;
    private final ReservationRepository reservationRepository;
    private final BarberShopIncomeRepository barberShopIncome;
    private final EmailService emailService;
    private final BarberService barberService;

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request){
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(()->new ResourceNotFoundException("Reserva no encontrada"));

        //validar estado
        if(!reservation.getStatus().equals(ReservationStatus.COMPLETADA)){
            throw new ValidationException("La reserva debe estar completada");
        }
        //sin transaccion previa
        if(reservation.getTransaction()!=null){
            throw new ValidationException("La reserva ya tiene una transaccion");
        }

        //barbero
        Barber barber = barberRepository.findById(reservation.getBarber().getId())
                .orElseThrow(()->new ResourceNotFoundException("Barbero no encontrado"));

        if(request.getTotalAmount().compareTo(reservation.getFinalPrice()) <0 ){
            throw new ValidationException("El monto pagado no puede ser menor al precio del servicio");
        }
        if (request.getTip().compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("La propina no puede ser negativa");
        }

        //precio
        BigDecimal price = reservation.getFinalPrice();

        //commission barbero
        BigDecimal commissionBarber = barber.getCommission();
        BigDecimal tip = request.getTip();
        BigDecimal amount = request.getTotalAmount();

        BigDecimal commission = price.multiply(commissionBarber);
        BigDecimal barberAmount = commission.add(tip);
        BigDecimal amountBarberShop = amount.subtract(commission);

        //Crear Transaccion
        Transaction transaction = buildTransaction(reservation,barber,request,commission,barberAmount);
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
        createBarberShopIncome(transaction);

        //enviar email
        sendTransactionNotifications(transaction);

        return mapToResponse(transaction);
    }

    @Transactional
    public void createBarberShopIncome(Transaction transaction){

        if (transaction.getPaymentStatus() != PaymentStatus.PAGADO) {
            throw new ValidationException("No se puede crear un ingreso si la transacción no está pagada");
        }

        Reservation reservation = transaction.getReservation();
        Barber barber = transaction.getBarber();
        BigDecimal commissionPercentage = barber.getCommission()
                .multiply(BigDecimal.valueOf(100))  // 0.15 → 15.00
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal total = transaction.getTotalAmount();
        BigDecimal barberCommission = transaction.getBarberCommission();
        BigDecimal tip = transaction.getTip()  != null ? transaction.getTip() : BigDecimal.ZERO;

        //monto barberia
        BigDecimal commission = transaction.getBarberCommission();
        BigDecimal BarberShopAmount = total.subtract(commission);

        BarberShopIncome income = new BarberShopIncome();
        income.setTransactionId(transaction.getId());
        income.setBarbershopId(reservation.getBarber().getBarberShop().getId());
        income.setBarberId(transaction.getBarber().getId());

        income.setTotalAmount(total);
        income.setBarberAmount(barberCommission);
        income.setBarberShopAmount(BarberShopAmount);

        income.setTipAmount(tip);
        income.setCommissionPercentage(commissionPercentage);
        income.setPaymentMethod(transaction.getPaymentMethod());
        income.setTransactionCode(transaction.getTransactionCode());
        income.setCreationDate(transaction.getPaymentDate());
        income.setTransactionDate(transaction.getPaymentDate());
        income.setNote(transaction.getNotes());
        barberShopIncome.save(income);



    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> listTodayTransactions(){
        Long barberId = barberService.getAuthenticatedBarber().getId();

        List<Transaction> transactions = transactionRepository.findTodayTransactionsByBarber(barberId);

        return transactions.stream()
                .map(this::mapToResponse)
                .toList();

    }

    private String generateTransactionCode() {
        // Tomar primeros 12 caracteres del UUID
        String uuidPart = UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase();

        return "TRX-" + uuidPart;
    }

    //enviar emails
    private void sendTransactionNotifications(Transaction transaction){
        TransactionEmailData data = buildTransactionEmailData(transaction);
        CompletableFuture<Void> clientEmail = CompletableFuture.runAsync(()->{
            try {
                emailService.sendTransactionConfirmationToClient(data);
                log.info("Email de transacción enviado al cliente: {}", data.clientEmail());
            }catch (Exception e){
                log.error("Error email cliente transacción {}: {}",
                        transaction.getId(), e.getMessage());
            }
        });

        CompletableFuture<Void> barberEmail = CompletableFuture.runAsync(()->{
            try {
                emailService.sendTransactionNotificationToBarber(data);
                log.info("Email de transaccion enviado al barbero: {} ", data.barberEmail());
            }catch (Exception e){
                log.error("Error email Barbero transaccion {}: {}",
                        transaction.getId(),e.getMessage());
            }
        });

        CompletableFuture<Void> barbershopEmail = CompletableFuture.runAsync(()->{
            try {
                emailService.sendTransactionNotificationToBarberShop(data);
                log.info("Email de transaccion enviado a la barberia: {} ", data.barberShopEmail());
            }catch (Exception e){
                log.error("Error email barberia transaccion {}: {}",
                        transaction.getId(),e.getMessage());
            }
        });

        CompletableFuture.allOf(clientEmail,barberEmail,barbershopEmail)
                .exceptionally(throwable -> {
                    log.error("Error general en emails transacción {}: {}",
                            transaction.getId(), throwable.getMessage());
                    return null;
                });
    }

    private Transaction buildTransaction(Reservation reservation, Barber barber, TransactionRequest request, BigDecimal commision,BigDecimal barberAmount){
        return Transaction.builder()
                .reservation(reservation)
                .barber(barber)
                .totalAmount(request.getTotalAmount())
                .barberCommission(commision)
                .barberAmount(barberAmount)
                .tip(request.getTip())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDIENTE)
                .transactionCode(generateTransactionCode())
                .paymentDate(LocalDateTime.now())
                .notes(request.getNotes())
                .build();
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

    private TransactionEmailData buildTransactionEmailData(Transaction transaction) {
        Reservation reservation = transaction.getReservation();
        String fullNameClient = reservation.getClient().getUser().getFirstName() + " " + reservation.getClient().getUser().getLastName();
        String fullNameBarber = transaction.getBarber().getUser().getFirstName() + " " + transaction.getBarber().getUser().getLastName();
        return new TransactionEmailData(
                transaction.getId(),
                transaction.getTransactionCode(),
                transaction.getPaymentDate(),
                transaction.getTotalAmount(),
                transaction.getTip(),
                transaction.getBarberCommission(),
                transaction.getTotalAmount().subtract(transaction.getBarberCommission()),
                transaction.getPaymentMethod(),

                fullNameClient,
                reservation.getClient().getUser().getEmail(),
                reservation.getClient().getUser().getPhone(),

                fullNameBarber,
                transaction.getBarber().getUser().getEmail(),

                transaction.getBarber().getBarberShop().getName(),
                transaction.getBarber().getBarberShop().getUser().getEmail(),
                transaction.getBarber().getBarberShop().getAddress(),
                transaction.getBarber().getBarberShop().getPhone(),

                reservation.getId(),
                reservation.getDate(),
                reservation.getStartTime(),
                mapToServiceInfo(reservation.getServices())

        );


    }

    private List<ServiceInfo> mapToServiceInfo(List<SubCategory> services) {
        return ServiceMapper.mapToServiceInfo(services);
    }

}

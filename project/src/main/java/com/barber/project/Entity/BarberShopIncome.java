package com.barber.project.Entity;

import com.barber.project.Entity.enums.PaymentMethodStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "barbershop_incomes")
@Data
public class BarberShopIncome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "transaction_id", nullable = false)
    private Long transactionId;
    @Column(name = "barbershop_id", nullable = false)
    private Long barbershopId;
    @Column(name = "barber_id", nullable = false)
    private Long barberId;
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;
    @Column(name = "barbershop_share_amount", nullable = false)
    private BigDecimal barberShopAmount;
    @Column(name = "barber_share_amount", nullable = false)
    private BigDecimal barberAmount;
    @Column(name = "tip_amount")
    private BigDecimal tipAmount = BigDecimal.ZERO;
    @Column(name = "commission_percentage")
    private BigDecimal commissionPercentage;
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethodStatus paymentMethod;
    @Column(name = "transaction_code")
    private String transactionCode;
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate = LocalDateTime.now();

    private String note;


}

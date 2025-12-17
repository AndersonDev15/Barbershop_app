package com.barber.project.Entity;

import com.barber.project.Entity.enums.PaymentMethodStatus;
import com.barber.project.Entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    @Column(name = "barber_comision")
    private BigDecimal barberCommission;
    @Column(name = "barber_amount")
    private BigDecimal barberAmount;
    private BigDecimal tip;

    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    private PaymentMethodStatus paymentMethod;
    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(name = "transaction_code")
    private String transactionCode;
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    private String notes;

    //relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_id")
    private Barber barber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id" )
    private Reservation reservation;

}

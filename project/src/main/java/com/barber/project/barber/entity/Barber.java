package com.barber.project.barber.entity;

import com.barber.project.transaction.entity.Transaction;
import com.barber.project.barber.entity.enums.BarberStatus;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "barber")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Barber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "document_number")
    private String documentNumber;
    private BigDecimal commission;
    @Enumerated(EnumType.STRING)
    private BarberStatus status = BarberStatus.ACTIVO;

    //relaciones
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barbershop_id")
    private BarberShop barberShop;

    @OneToMany(mappedBy = "barber", fetch = FetchType.LAZY)
    private List<Transaction> transactions = new ArrayList<>();



}

package com.barber.project.Entity;

import com.barber.project.Entity.enums.BarberStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "barber")
@Data
@NoArgsConstructor
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

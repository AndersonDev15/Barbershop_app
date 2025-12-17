package com.barber.project.Entity;

import com.barber.project.Entity.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "final_price")
    private BigDecimal finalPrice;
    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.PENDIENTE;

    @Column(name = "reservation_date")
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    //relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_id")
    private Barber barber;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "reservation_items",  // Tu tabla existente
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "subcategory_id")
    )

    private List<SubCategory> services = new ArrayList<>();

    @OneToOne(mappedBy = "reservation", fetch = FetchType.LAZY)
    private Transaction transaction;


}

package com.barber.project.reservation.entity;

import com.barber.project.client.entity.Client;
import com.barber.project.transaction.entity.Transaction;
import com.barber.project.reservation.entity.enums.ReservationStatus;
import com.barber.project.barber.entity.Barber;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
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

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReservationItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "reservation", fetch = FetchType.LAZY)
    private Transaction transaction;


    public void addService(Long subcategoryId) {
        ReservationItem item = new ReservationItem(this, subcategoryId);
        this.items.add(item);
    }

    public void removeService(ReservationItem item) {
        items.remove(item);
        item.setReservation(null);
    }

    public List<ReservationItem> getItems() {
        return Collections.unmodifiableList(items);
    }


}

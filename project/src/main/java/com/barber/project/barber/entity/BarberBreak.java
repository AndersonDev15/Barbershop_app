package com.barber.project.barber.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "barber_break")
@Data
@NoArgsConstructor
public class BarberBreak {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "start_time")
    private LocalTime start;
    @Column(name = "end_time")
    private LocalTime end;
    @Column(name = "break_date")
    private LocalDate date;

    //relacion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_id")
    private Barber barber;

}

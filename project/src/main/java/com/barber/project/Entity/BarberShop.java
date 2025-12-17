package com.barber.project.Entity;

import com.barber.project.Entity.enums.BarberShopStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "barbershop")
public class BarberShop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String phone;
    @Enumerated(EnumType.STRING)
    private BarberShopStatus status = BarberShopStatus.ACTIVO;

    //relaciones
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User user;

    @OneToMany(mappedBy = "barberShop", fetch = FetchType.LAZY)
    private List<Barber> barbers = new ArrayList<>();

    @OneToMany(mappedBy = "barberShop",fetch = FetchType.LAZY)
    private List<Category> categories = new ArrayList<>();

}

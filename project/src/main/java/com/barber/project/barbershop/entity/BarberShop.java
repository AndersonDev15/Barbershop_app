package com.barber.project.barbershop.entity;

import com.barber.project.barber.entity.Barber;
import com.barber.project.user.entity.User;
import com.barber.project.barbershop.entity.enums.BarberShopStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "barbershop")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarberShop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String department;
    private String city;
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

    @OneToMany(mappedBy = "barberShop", fetch = FetchType.LAZY)
    private List<BarberShopImage> images;

}

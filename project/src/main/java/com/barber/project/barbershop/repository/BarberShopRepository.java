package com.barber.project.barbershop.repository;

import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BarberShopRepository extends JpaRepository<BarberShop,Long> {
   // Optional<BarberShop> findByUserEmail(String email);
    Optional<BarberShop> findByUser(User user);
    Optional<BarberShop> findByUser_UserUuid(String userUuid);
    Optional<BarberShop> findByNameIgnoreCase(String name);
    boolean existsByUser_UserUuid(String userUuid);


}

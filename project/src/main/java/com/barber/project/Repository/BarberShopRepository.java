package com.barber.project.Repository;

import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.User;
import com.barber.project.Entity.enums.BarberShopStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BarberShopRepository extends JpaRepository<BarberShop,Long> {
    Optional<BarberShop> findByUserEmail(String email);
    Optional<BarberShop> findByUser(User user);
    Optional<BarberShop> findByNameIgnoreCase(String name);


}

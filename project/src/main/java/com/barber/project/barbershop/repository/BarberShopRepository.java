package com.barber.project.barbershop.repository;

import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.enums.BarberShopStatus;
import com.barber.project.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BarberShopRepository extends JpaRepository<BarberShop,Long> {
   // Optional<BarberShop> findByUserEmail(String email);
    Optional<BarberShop> findByUser(User user);
 Page<BarberShop> findByCityIgnoreCaseAndStatus(
         String city,
         BarberShopStatus status,
         Pageable pageable
 );
    Optional<BarberShop> findByUser_UserUuid(String userUuid);
    List<BarberShop> findByNameContainingIgnoreCase(String name);
    boolean existsByUser_UserUuid(String userUuid);


}

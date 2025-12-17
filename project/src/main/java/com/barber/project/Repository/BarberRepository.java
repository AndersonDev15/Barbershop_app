package com.barber.project.Repository;

import com.barber.project.Entity.Barber;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Client;
import com.barber.project.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BarberRepository extends JpaRepository<Barber, Long> {
    Optional<Barber> findByUserAndBarberShop(User user, BarberShop barberShop);
    Optional<Barber> findByIdAndBarberShopId(Long barberId, Long barberShopId);
    List<Barber> findByBarberShop(BarberShop barberShop);

    Optional<Barber> findByUser(User user);
    Optional<Barber> findByUserEmail(String email);

    //contar barberos
    @Query("""
        SELECT COUNT(b)
        FROM Barber b
       WHERE b.barberShop.id = :barbershopId
        AND b.status = 'ACTIVO'
    """)
    Long countActiveBarbers(@Param("barbershopId") Long barbershopId);
}


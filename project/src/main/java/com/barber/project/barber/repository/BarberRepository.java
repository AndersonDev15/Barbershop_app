package com.barber.project.barber.repository;

import com.barber.project.barber.entity.Barber;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BarberRepository extends JpaRepository<Barber, Long> {
    Optional<Barber> findByUserAndBarberShop(User user, BarberShop barberShop);
    Optional<Barber>findByUser_UserUuid(String userUuid);
    Optional<Barber> findByIdAndBarberShop_Id(Long barberId, Long barberShopId);
    Page<Barber> findByBarberShopId(Long barberShopId, Pageable pageable);
    List<Barber>findByBarberShop_Id(Long barbershopId );
    @Query("SELECT b FROM Barber b JOIN FETCH b.user WHERE b.barberShop.id = :barberShopId")
    List<Barber> findByBarberShopIdWithUser(@Param("barberShopId") Long barberShopId);
    Optional<Barber> findByUser(User user);
   // Optional<Barber> findByUserEmail(String email);

    //contar barberos
    @Query("""
        SELECT COUNT(b)
        FROM Barber b
       WHERE b.barberShop.id = :barbershopId
        AND b.status = 'ACTIVO'
    """)
    Long countActiveBarbers(@Param("barbershopId") Long barbershopId);
}


package com.barber.project.Repository;

import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.BarberShopImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BarberShopImageRepository extends JpaRepository<BarberShopImage,Long> {
    long countByBarberShop(BarberShop barberShop);
    List<BarberShopImage> findByBarberShop(BarberShop barberShop);
    Optional<BarberShopImage>findByIdAndBarberShop(Long id,BarberShop barberShop);
    @Modifying
    @Query("UPDATE BarberShopImage i SET i.isCover = false WHERE i.barberShop.id = :barberShopId")
    void clearCoverForBarberShop(Long barberShopId);
}

package com.barber.project.barbershop.repository;

import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.Category;
import com.barber.project.barbershop.entity.enums.CategoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    boolean existsByBarberShopAndNameIgnoreCase(BarberShop barberShop, String name);

    List<Category> findByBarberShop(BarberShop barberShop);
    Optional<Category> findByIdAndBarberShop(Long id, BarberShop barberShop);
    List<Category> findByBarberShop_IdAndStatus(Long barberShopId, CategoryStatus status);
}

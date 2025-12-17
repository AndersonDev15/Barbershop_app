package com.barber.project.Repository;

import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    boolean existsByBarberShopAndNameIgnoreCase(BarberShop barberShop, String name);

    List<Category> findByBarberShop(BarberShop barberShop);
    Optional<Category> findByIdAndBarberShop(Long id, BarberShop barberShop);
}

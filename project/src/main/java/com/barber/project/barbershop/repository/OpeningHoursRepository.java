package com.barber.project.barbershop.repository;

import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.OpeningHours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface OpeningHoursRepository extends JpaRepository<OpeningHours,Long> {
    List<OpeningHours> findByBarberShopAndDayOfWeek(BarberShop barberShop, DayOfWeek day);
    List<OpeningHours> findByBarberShop(BarberShop barberShop);


}

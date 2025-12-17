package com.barber.project.Repository;

import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.OpeningHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface OpeningHoursRepository extends JpaRepository<OpeningHours,Long> {
    List<OpeningHours> findByBarberShopAndDayOfWeek(BarberShop barberShop, DayOfWeek day);
    List<OpeningHours> findByBarberShop(BarberShop barberShop);


}

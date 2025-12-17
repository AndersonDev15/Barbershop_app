package com.barber.project.Repository;

import com.barber.project.Entity.BarberBreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BarberBreakRepository extends JpaRepository<BarberBreak, Long> {
    List<BarberBreak> findByBarberIdAndDate(Long barberId, LocalDate date);

    @Query("""
        SELECT CASE WHEN COUNT(br) > 0 THEN TRUE ELSE FALSE END
        FROM BarberBreak br
        WHERE br.barber.id = :barberId
          AND br.date = :date
          AND (br.start < :end AND br.end > :start)
    """)
    boolean existsOverlap(Long barberId, LocalDate date, LocalTime start, LocalTime end);
}

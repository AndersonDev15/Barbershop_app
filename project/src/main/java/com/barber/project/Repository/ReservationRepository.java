package com.barber.project.Repository;

import com.barber.project.Entity.Reservation;
import com.barber.project.Entity.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    // Traer todas las reservas del barbero en una fecha
    List<Reservation> findByBarberIdAndDate(Long barberId, LocalDate date);
    //verificar solapamiento
    @Query("""
    SELECT COUNT(r) > 0
    FROM Reservation r
    WHERE r.barber.id = :barberId
      AND r.date = :date
      AND r.status IN :statuses
      AND (r.startTime < :end AND r.endTime > :start)
""")
    boolean existsOverlap(
            Long barberId,
            LocalDate date,
            LocalTime start,
            LocalTime end,
            Set<ReservationStatus> statuses
    );
    @Query("""
    SELECT r
    FROM Reservation r
    WHERE r.barber.id = :barberId
      AND r.date = :date
      AND r.status IN :statuses
""")
    List<Reservation> findBlockingReservations(
            Long barberId,
            LocalDate date,
            Set<ReservationStatus> statuses
    );



    @Query("SELECT r FROM Reservation r WHERE r.barber.id = :barberId AND r.date = :date ORDER BY r.startTime ASC")
    List<Reservation> findByBarberIdAndDateOrderByStartTimeAsc(@Param("barberId") Long barberId,
                                                               @Param("date") LocalDate date);

    //Reservas del cliente con filtro de estado
    @Query("SELECT r FROM Reservation r WHERE r.client.id = :clientId AND r.status = :status ORDER BY r.date DESC, r.startTime DESC")
    List<Reservation> findByClientIdAndStatusOrderByDateDescTimeDesc(@Param("clientId") Long clientId,
                                                                     @Param("status") ReservationStatus status);

    //tiempo 20 minutos
    @Query("""
    SELECT r FROM Reservation r
    WHERE r.status = 'CONFIRMADA'
    AND r.date = :today
    AND r.startTime = :targetTime
""")
    List<Reservation> findReservationsStartingAt(
            @Param("today") LocalDate today,
            @Param("targetTime") LocalTime targetTime
    );

    // Todas las reservas del cliente ordenadas
    @Query("SELECT r FROM Reservation r WHERE r.client.id = :clientId ORDER BY r.date DESC, r.startTime DESC")
    List<Reservation> findByClientIdOrderByDateDescTimeDesc(@Param("clientId") Long clientId);
}

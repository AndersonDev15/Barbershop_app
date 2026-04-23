package com.barber.project.reservation.repository;

import com.barber.project.reservation.entity.Reservation;
import com.barber.project.reservation.entity.enums.ReservationStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
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
    SELECT COUNT(r) > 0 FROM Reservation r
    WHERE r.client.id = :clientId
    AND r.date = :date
    AND r.startTime < :newEndTime
    AND r.endTime > :newStartTime
""")
    boolean existsOverlappingReservation(
            Long clientId,
            LocalDate date,
            LocalTime newStartTime,
            LocalTime newEndTime
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



    @Query("""
        SELECT r FROM Reservation r
        JOIN FETCH r.items
        WHERE r.barber.id = :barberId
        AND r.date = :date
        ORDER BY r.startTime ASC
    """)
    List<Reservation> findByBarberIdAndDateOrderByStartTimeAsc(
            @Param("barberId") Long barberId,
            @Param("date") LocalDate date
    );

    //Reservas del cliente con filtro de estado
    @Query("""
        SELECT r FROM Reservation r
        JOIN FETCH r.items
        WHERE r.client.id = :clientId
        AND r.status = :status
        ORDER BY r.date DESC, r.startTime DESC
    """)
    List<Reservation> findByClientIdAndStatusOrderByDateDescTimeDesc(
            @Param("clientId") Long clientId,
            @Param("status") ReservationStatus status
    );

    //tiempo 20 minutos
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT r FROM Reservation r
            WHERE r.barber.id = :barberId
            AND r.date = :date
            """)
    List<Reservation> lockReservationsForDay(
            Long barberId,
            LocalDate date
    );

    // Todas las reservas del cliente ordenadas
    @Query("""
        SELECT r FROM Reservation r
        JOIN FETCH r.items
        WHERE r.client.id = :clientId
        ORDER BY r.date DESC, r.startTime DESC
    """)
    List<Reservation> findByClientIdOrderByDateDescTimeDesc(
            @Param("clientId") Long clientId
    );

    @Query("""
        SELECT r FROM Reservation r
        JOIN FETCH r.items
        WHERE r.date = :date
        AND r.startTime BETWEEN :from AND :to
    """)
    List<Reservation> findReservationsStartingBetween(
            @Param("date") LocalDate date,
            @Param("from") LocalTime from,
            @Param("to") LocalTime to
    );
}

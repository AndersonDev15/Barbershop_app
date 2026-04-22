package com.barber.project.transaction.repository;

import com.barber.project.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {

    Optional<Transaction> findByReservationId(Long reservationId);
    boolean existsByReservationId(Long reservationId);


    @Query("""
            SELECT t FROM Transaction t
            WHERE t.barber.id = :barberId
            AND t.paymentStatus = 'PAGADO'
            AND t.paymentDate BETWEEN :start AND :end
            """)
    List<Transaction> findCompletedByBarberAndDateRange(
            @Param("barberId") Long barberId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
    SELECT t FROM Transaction t
    WHERE t.barber.id = :barberId
    AND t.createdAt >= :startOfDay
    AND t.createdAt < :endOfDay
""")
    List<Transaction> findTodayTransactionsByBarber(
            @Param("barberId") Long barberId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}


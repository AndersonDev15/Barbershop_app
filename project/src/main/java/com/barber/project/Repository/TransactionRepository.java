package com.barber.project.Repository;

import com.barber.project.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {

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
        AND t.paymentStatus = 'PENDIENTE'
        AND DATE(t.paymentDate) = CURRENT_DATE
    """)
    List<Transaction> findTodayTransactionsByBarber(@Param("barberId") Long barberId);
}


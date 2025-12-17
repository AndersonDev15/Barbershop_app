package com.barber.project.Repository;

import com.barber.project.Dto.Response.Reports.BarberShop.BarberIncomeSummary;
import com.barber.project.Entity.BarberShopIncome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BarberShopIncomeRepository extends JpaRepository<BarberShopIncome,Long> {

    @Query(value = """
        SELECT * FROM barbershop_incomes bi
        WHERE bi.barbershop_id = :barbershopId
        AND DATE(bi.creation_date) BETWEEN :start AND :end
        """, nativeQuery = true)
    List<BarberShopIncome> findByBarbershopIdAndDateRange(
            @Param("barbershopId") Long barbershopId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    @Query(value = """
        SELECT * FROM barbershop_incomes bi
        WHERE bi.barbershop_id = :barbershopId
        AND DATE(bi.creation_date) = :date
        """, nativeQuery = true)
    List<BarberShopIncome> findByBarbershopIdAndDate(
            @Param("barbershopId") Long barbershopId,
            @Param("date") LocalDate date);

    @Query(value = """
        SELECT 
            bi.barber_id as barberId,                
            SUM(bi.barber_share_amount + bi.tip_amount) as total  
        FROM barbershop_incomes bi
        WHERE bi.barbershop_id = :barbershopId 
          AND DATE(bi.creation_date) BETWEEN :start AND :end
        GROUP BY bi.barber_id
        ORDER BY total DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<BarberIncomeSummary> findTopBarberIds(
            @Param("barbershopId") Long barbershopId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("limit") int limit);
}

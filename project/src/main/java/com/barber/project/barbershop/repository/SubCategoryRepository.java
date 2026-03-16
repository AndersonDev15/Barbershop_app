package com.barber.project.barbershop.repository;

import com.barber.project.barbershop.entity.Category;
import com.barber.project.barbershop.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubCategoryRepository extends JpaRepository<SubCategory,Long> {
    boolean existsByCategoryAndNameIgnoreCase(Category category, String name);
    List<SubCategory> findByCategory(Category category);
    Optional<SubCategory> findByIdAndCategory(Long id, Category category);
    List<SubCategory> findByCategory_Id(Long categoryId);

    @Query("""
    SELECT s FROM SubCategory s
    WHERE s.id IN (
        SELECT ri.subcategoryId FROM ReservationItem ri
        WHERE ri.reservation.id IN :reservationIds
    )
""")
    List<SubCategory> findByReservationIds(@Param("reservationIds") List<Long> reservationIds);

}

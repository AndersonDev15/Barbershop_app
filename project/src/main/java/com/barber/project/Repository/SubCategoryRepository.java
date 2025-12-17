package com.barber.project.Repository;

import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Category;
import com.barber.project.Entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubCategoryRepository extends JpaRepository<SubCategory,Long> {
    boolean existsByCategoryAndNameIgnoreCase(Category category, String name);
    List<SubCategory> findByCategory(Category category);
    Optional<SubCategory> findByIdAndCategory(Long id, Category category);

}

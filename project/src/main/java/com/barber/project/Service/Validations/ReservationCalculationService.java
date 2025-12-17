package com.barber.project.Service.Validations;

import com.barber.project.Dto.Validations.ServiceCalculationResult;
import com.barber.project.Entity.SubCategory;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.SubCategoryRepository;
import com.barber.project.Service.BarberShop.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationCalculationService {
    private static final int BLOCK_MINUTES = 15;
    private final SubCategoryRepository subCategoryRepository;
    private final CategoryService categoryService;

    public ServiceCalculationResult calculateServices(List<Long> subcategoryIds) {
        List<SubCategory> services = subCategoryRepository.findAllById(subcategoryIds);

        if (services.isEmpty()) {
            throw new ResourceNotFoundException("Servicios no encontrados");
        }
        validateParentCategoriesAreActive(services);

        BigDecimal totalPrice = services.stream()
                .map(SubCategory::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalDuration = services.stream()
                .mapToInt(SubCategory::getDuration)
                .sum();

        int requiredBlocks = calculateRequiredBlocks(totalDuration);

        return new ServiceCalculationResult(services, totalPrice, totalDuration, requiredBlocks);
    }

    public int calculateRequiredBlocks(int durationMinutes) {
        return (int) Math.ceil(durationMinutes / (double) BLOCK_MINUTES);
    }

    private void validateParentCategoriesAreActive(List<SubCategory> subCategories) {
        // Extraer IDs únicos de categorías
        List<Long> categoryIds = subCategories.stream()
                .map(subCategory -> subCategory.getCategory().getId())
                .distinct()
                .toList();

        if (!categoryIds.isEmpty()) {
            categoryService.validateCategoriesAreActive(categoryIds);
        }
    }


}

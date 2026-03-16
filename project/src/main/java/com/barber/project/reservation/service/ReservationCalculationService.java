package com.barber.project.reservation.service;

import com.barber.project.reservation.dto.response.ServiceInfo;
import com.barber.project.reservation.dto.internal.ServiceCalculationResult;
import com.barber.project.Util.TimeUtils;
import com.barber.project.barbershop.entity.SubCategory;
import com.barber.project.barbershop.service.CategoryService;
import com.barber.project.barbershop.service.SubCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationCalculationService {
    private static final int BLOCK_MINUTES = 15;
    private final SubCategoryService subCategoryService;
    private final CategoryService categoryService;

    public ServiceCalculationResult calculateServices(List<Long> subcategoryIds) {
        List<SubCategory> services = subCategoryService.findAllById(subcategoryIds); // ✅

        validateParentCategoriesAreActive(services);

        BigDecimal totalPrice = services.stream()
                .map(SubCategory::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalDuration = services.stream()
                .mapToInt(SubCategory::getDuration)
                .sum();

        int requiredBlocks = TimeUtils.calculateRequiredBlocks(totalDuration);

        return new ServiceCalculationResult(
                subcategoryIds,
                mapToServiceInfo(services),
                totalPrice,
                totalDuration,
                requiredBlocks
        );
    }

    private void validateParentCategoriesAreActive(List<SubCategory> subCategories) {
        List<Long> categoryIds = subCategories.stream()
                .map(subCategory -> subCategory.getCategory().getId())
                .distinct()
                .toList();

        if (!categoryIds.isEmpty()) {
            categoryService.validateCategoriesAreActive(categoryIds);
        }
    }

    private List<ServiceInfo> mapToServiceInfo(List<SubCategory> services) {
        return services.stream()
                .map(s -> new ServiceInfo(
                        s.getId(),
                        s.getName(),
                        s.getDuration(),
                        s.getPrice()
                ))
                .toList();
    }
}
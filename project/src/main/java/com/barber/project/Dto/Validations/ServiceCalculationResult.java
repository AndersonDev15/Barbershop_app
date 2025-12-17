package com.barber.project.Dto.Validations;

import com.barber.project.Entity.SubCategory;

import java.math.BigDecimal;
import java.util.List;

public record ServiceCalculationResult(List<SubCategory> services,
                                       BigDecimal totalPrice,
                                       int totalDuration,
                                       int requiredBlocks) {
}

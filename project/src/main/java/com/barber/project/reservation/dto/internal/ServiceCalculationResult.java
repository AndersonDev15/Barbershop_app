package com.barber.project.reservation.dto.internal;

import com.barber.project.reservation.dto.response.ServiceInfo;

import java.math.BigDecimal;
import java.util.List;

public record ServiceCalculationResult(
        List<Long> subcategoryIds,
        List<ServiceInfo> services,
        BigDecimal totalPrice,
        int totalDuration,
        int requiredBlocks
) {}

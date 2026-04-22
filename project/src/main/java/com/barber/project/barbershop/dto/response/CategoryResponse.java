package com.barber.project.barbershop.dto.response;

import com.barber.project.barbershop.entity.enums.CategoryStatus;

public record CategoryResponse(
        Long id,
        String name,
        String description,
        CategoryStatus status
) {}
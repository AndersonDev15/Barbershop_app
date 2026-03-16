package com.barber.project.barbershop.dto.response;

import java.math.BigDecimal;


public record SubCategoryResponse(
         Long id,
         String name,
         String description,
         Integer duration,
         BigDecimal price
) {}

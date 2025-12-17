package com.barber.project.Dto.Response.BarberShop;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class SubCategoryResponse {
    private Long id;
    private String name;
    private String description;
    private Integer duration;
    private BigDecimal price;
}

package com.barber.project.Dto.Response.Reports.BarberShop;

import lombok.Data;

import java.math.BigDecimal;


public interface BarberIncomeSummary {
    Long getBarberId();
    BigDecimal getTotal();
}
package com.barber.project.barber.dto.internal;

import com.barber.project.barber.entity.Barber;
import com.barber.project.barbershop.entity.BarberShop;

public record BarberValidationResult(
        Barber barber,
        BarberShop barberShop) {}

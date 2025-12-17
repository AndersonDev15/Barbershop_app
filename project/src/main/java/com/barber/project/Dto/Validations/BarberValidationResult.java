package com.barber.project.Dto.Validations;

import com.barber.project.Entity.Barber;
import com.barber.project.Entity.BarberShop;

public record BarberValidationResult(Barber barber, BarberShop barberShop) {}

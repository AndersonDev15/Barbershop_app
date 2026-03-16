package com.barber.project.barbershop.dto.response;

public record BarberShopProfileResponse(
        Long id,
        String barberShopName,
        String address,
        String phone
) {}

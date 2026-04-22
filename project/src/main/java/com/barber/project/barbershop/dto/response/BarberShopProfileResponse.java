package com.barber.project.barbershop.dto.response;

import com.barber.project.barbershop.entity.enums.BarberShopStatus;

public record BarberShopProfileResponse(
        Long id,
        String barberShopName,
        String department,
        String city,
        String address,
        String phone,
        BarberShopStatus status,
        String coverImageUrl
) {}

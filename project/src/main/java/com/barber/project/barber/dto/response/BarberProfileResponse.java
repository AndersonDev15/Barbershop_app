package com.barber.project.barber.dto.response;

import java.math.BigDecimal;

public record BarberProfileResponse(
        String firstName,
        String lastName,
        String email,
        String phone,
        String documentNumber,
        BigDecimal commission,
        String barberShopName
) {}

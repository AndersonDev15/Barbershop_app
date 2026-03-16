package com.barber.project.barber.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InvitationDetailsResponse(
        String barberShopName,
        String barberShopAddress,
        BigDecimal commission,
        String documentNumber,
        LocalDateTime expiresAt
) {}

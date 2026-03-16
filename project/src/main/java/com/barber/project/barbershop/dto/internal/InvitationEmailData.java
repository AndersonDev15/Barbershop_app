package com.barber.project.barbershop.dto.internal;

import java.time.LocalDateTime;

public record InvitationEmailData(
        String invitedEmail,
        String barberShopName,
        String token,
        LocalDateTime expiresAt
) {}
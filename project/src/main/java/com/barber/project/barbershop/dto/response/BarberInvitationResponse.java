package com.barber.project.barbershop.dto.response;

import com.barber.project.barbershop.entity.enums.InvitationStatus;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record BarberInvitationResponse(
        String invitedEmail,
        String token,
        LocalDateTime expiresAt,
        InvitationStatus status
) {}
package com.barber.project.barber.service;

import com.barber.project.barber.dto.request.BarberRequest;
import com.barber.project.barber.dto.response.InvitationDetailsResponse;
import com.barber.project.barbershop.dto.response.BarberInvitationResponse;
import com.barber.project.barbershop.entity.BarberInvitation;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.service.BarberInvitationService;
import com.barber.project.user.entity.User;
import com.barber.project.barbershop.entity.enums.InvitationStatus;
import com.barber.project.user.service.UserService;
import com.barber.project.notification.service.NotificationService;
import com.barber.project.notification.enums.NotificationType;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberInvitationResponseService {

    private final BarberInvitationService barberInvitationService;
    private final UserService userService;
    private final BarberService barberService;
    private final NotificationService notificationService;


    @Transactional(readOnly = true)
    public List<BarberInvitationResponse> getPendingInvitations(String email) {
        return barberInvitationService.getPendingInvitations(email);
    }


    @Transactional(readOnly = true)
    public InvitationDetailsResponse getInvitationDetails(String token) {

        BarberInvitation invitation = barberInvitationService.findByToken(token);

        validateInvitation(invitation);

        return new InvitationDetailsResponse(
                invitation.getBarberShop().getName(),
                invitation.getBarberShop().getAddress(),
                invitation.getCommission(),
                invitation.getDocumentNumber(),
                invitation.getExpiresAt()
        );
    }


    @Transactional
    public void acceptInvitation(String barberUuid, String email, String token) {

        BarberInvitation invitation = barberInvitationService.findByToken(token);

        validateInvitation(invitation);

        if (!invitation.getInvitedEmail().equalsIgnoreCase(email)) {
            throw new ValidationException("Esta invitación no es para tu cuenta");
        }

        User barberUser = userService.getByUuid(barberUuid);

        barberService.validateUserHasNoBarberShop(barberUser);

        barberService.createBarber(
                barberUser,
                invitation.getBarberShop(),
                invitation
        );

        barberInvitationService.markAsAccepted(invitation);

        // Notificar al barbero
        notificationService.createNotification(
                barberUuid,
                NotificationType.INVITATION_RECEIVED,
                "Invitación aceptada",
                "Te has unido a " + invitation.getBarberShop().getName() + " exitosamente.",
                invitation.getId()
        );
    }

    @Transactional
    public void rejectInvitation(String barberUuid, String token) {

        BarberInvitation invitation = barberInvitationService.findByToken(token);

        validateInvitation(invitation);

        User barberUser = userService.getByUuid(barberUuid);

        if (!invitation.getInvitedEmail().equalsIgnoreCase(barberUser.getEmail())) {
            throw new ValidationException("Esta invitación no es para tu cuenta");
        }

        barberInvitationService.markAsCanceled(invitation);
    }

    private void validateInvitation(BarberInvitation invitation) {

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            barberInvitationService.markAsExpired(invitation);
            throw new ValidationException("Invitación expirada");
        }

        if (invitation.getInvitationStatus() != InvitationStatus.PENDING) {
            throw new ValidationException("Esta invitación ya fue procesada");
        }
    }
}
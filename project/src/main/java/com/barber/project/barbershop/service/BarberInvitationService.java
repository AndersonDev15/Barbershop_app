package com.barber.project.barbershop.service;

import com.barber.project.barbershop.dto.internal.InvitationEmailData;
import com.barber.project.barbershop.dto.request.CreateBarberInvitationRequest;
import com.barber.project.barbershop.dto.response.BarberInvitationResponse;
import com.barber.project.barbershop.entity.BarberInvitation;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.enums.InvitationStatus;
import com.barber.project.infrastructure.email.EmailService;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.barbershop.repository.BarberInvitationRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BarberInvitationService {

    private final BarberInvitationRepository barberInvitationRepository;
    private final BarberShopService barberShopService;
    private final EmailService emailService;

    @Transactional
    public BarberInvitationResponse barberInvitation(
            UUID ownerUuid,
            CreateBarberInvitationRequest request
    ){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        boolean existsPending = barberInvitationRepository.existsByInvitedEmailAndInvitationStatus(
                request.email(),
                InvitationStatus.PENDING);

        if(existsPending){
            throw new ValidationException("Ya existe una solocitud pendiente a este correo");
        }
        String token = UUID.randomUUID().toString();

        BarberInvitation invitation = BarberInvitation.builder()
                .token(token)
                .invitedEmail(request.email())
                .documentNumber(request.documentNumber())
                .commission(request.commission())
                .invitationStatus(InvitationStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(3))
                .barberShop(barberShop)
                .build();

        barberInvitationRepository.save(invitation);

        InvitationEmailData emailData = new InvitationEmailData(
                invitation.getInvitedEmail(),
                barberShop.getName(),
                invitation.getToken(),
                invitation.getExpiresAt()
        );
        emailService.sendBarberInvitation(emailData);

        return new BarberInvitationResponse(
                invitation.getInvitedEmail(),
                invitation.getToken(),
                invitation.getExpiresAt(),
                invitation.getInvitationStatus()
        );

    }

    @Transactional(readOnly = true)
    public List<BarberInvitationResponse> getInvitation(UUID ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        return barberInvitationRepository.findByBarberShopId(barberShop.getId())
                .stream()
                .map(invitation -> new BarberInvitationResponse(
                        invitation.getInvitedEmail(),
                        invitation.getToken(),
                        invitation.getExpiresAt(),
                        invitation.getInvitationStatus()
                ))
                .toList();
    }

    @Transactional
    public void cancelInvitation(UUID ownerUuid, String token){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        BarberInvitation barberInvitation = barberInvitationRepository.findByToken(token)
                .orElseThrow(()->new ResourceNotFoundException("Invitacion no encontrada"));

        if(!barberInvitation.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException("No puedes modificar invitaciones de otra barberia");
        }

        barberInvitation.setInvitationStatus(InvitationStatus.EXPIRED);
        barberInvitationRepository.save(barberInvitation);
    }

    public BarberInvitation findByToken(String token) {
        return barberInvitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invitación no encontrada"));
    }

    public List<BarberInvitationResponse> getPendingInvitations(String email) {
        return barberInvitationRepository
                .findByInvitedEmailAndInvitationStatusAndExpiresAtAfter(
                        email, InvitationStatus.PENDING, LocalDateTime.now()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void markAsExpired(BarberInvitation invitation) {
        invitation.setInvitationStatus(InvitationStatus.EXPIRED);
        barberInvitationRepository.save(invitation);
    }

    public void markAsAccepted(BarberInvitation invitation) {
        invitation.setInvitationStatus(InvitationStatus.ACCEPTED);
        barberInvitationRepository.save(invitation);
    }

    public void markAsCanceled(BarberInvitation invitation) {
        invitation.setInvitationStatus(InvitationStatus.CANCELED);
        barberInvitationRepository.save(invitation);
    }

    private BarberInvitationResponse mapToResponse(BarberInvitation invitation) {
        return BarberInvitationResponse.builder()
                .invitedEmail(invitation.getInvitedEmail())
                .token(invitation.getToken())
                .expiresAt(invitation.getExpiresAt())
                .status(invitation.getInvitationStatus())
                .build();
    }



}

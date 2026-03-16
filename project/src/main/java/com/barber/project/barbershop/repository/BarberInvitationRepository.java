package com.barber.project.barbershop.repository;

import com.barber.project.barbershop.entity.BarberInvitation;
import com.barber.project.barbershop.entity.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BarberInvitationRepository extends JpaRepository<BarberInvitation,Long> {

    Optional<BarberInvitation>findByToken(String token);
    List<BarberInvitation> findByBarberShopId(Long barberShopId);
    List<BarberInvitation> findByInvitedEmailAndInvitationStatusAndExpiresAtAfter(
            String email, InvitationStatus status, LocalDateTime now
    );
    boolean existsByInvitedEmailAndInvitationStatus(String email, InvitationStatus invitationStatus);
}

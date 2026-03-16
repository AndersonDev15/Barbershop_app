package com.barber.project.barbershop.entity;

import com.barber.project.barbershop.entity.enums.InvitationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "barber_invitation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarberInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String token;

    @Column(name = "invited_email", nullable = false)
    private String invitedEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "invitation_status", nullable = false)
    private InvitationStatus invitationStatus;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "document_number", nullable = false)
    private String documentNumber;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal commission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_shop_id", nullable = false)
    private BarberShop barberShop;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}

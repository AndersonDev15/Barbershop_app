package com.auth.server.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verification_token")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String token;

    @OneToOne
    @JoinColumn(name = "identity_id",referencedColumnName = "id")
    private AuthIdentity authIdentity;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    private boolean used = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}

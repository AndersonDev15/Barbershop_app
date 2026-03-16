package com.auth.server.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Entity
@Table(name = "federated_identities")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FederatedIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_identity_id", nullable = false)
    private AuthIdentity authIdentity;

    @Column(nullable = false)
    private String provider;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column(name = "provider_email", nullable = false)
    private String providerEmail;

    @Column(name = "provider_username")
    private String providerUsername;

    @Column(name = "provider_display_name")
    private String providerDisplayName;

    @CreationTimestamp
    private LocalDateTime linkedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}

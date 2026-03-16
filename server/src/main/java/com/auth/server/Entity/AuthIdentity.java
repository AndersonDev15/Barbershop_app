package com.auth.server.Entity;

import jakarta.persistence.*;
import jdk.dynalink.linker.LinkerServices;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "auth_identity")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AuthIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_uuid", nullable = false, unique = true, length = 36)
    private String userUuid;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private boolean enabled;

    @Column(name = "email_verified")
    private boolean emailVerified;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "auth_identity_role",
            joinColumns = @JoinColumn(name = "auth_identity_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<AuthRole> roles;

    @OneToMany(mappedBy = "authIdentity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FederatedIdentity>federatedIdentities = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

package com.barber.project.user.entity;

import com.barber.project.user.entity.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_uuid", columnDefinition = "CHAR(36)", nullable = false, unique = true )
    private String userUuid;

    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone")
    private String phone;



    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVO;

    @Column(name = "last_synced_at")  // Puede ser NULL
    private Instant lastSyncedAt;

    @CreationTimestamp
    @Column(name = "registration_date", updatable = false)
    private Instant registrationDate;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;




}

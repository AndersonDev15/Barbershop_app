package com.auth.server.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auth_role")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AuthRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // USER, ADMIN
}

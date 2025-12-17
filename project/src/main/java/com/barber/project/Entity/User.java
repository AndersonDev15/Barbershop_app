package com.barber.project.Entity;

import com.barber.project.Entity.enums.UserStatus;
import com.barber.project.Entity.enums.UserType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    private String phone;
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;
    @Column(name = "registration_date")
    private LocalDateTime registrationDate;
    @Column(name = "last_password_change")
    private LocalDateTime lastPasswordChange = LocalDateTime.now();
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVO;




}

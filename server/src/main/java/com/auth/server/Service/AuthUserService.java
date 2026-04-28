package com.auth.server.Service;

import com.auth.server.Dto.Request.RegisterRequest;
import com.auth.server.Dto.Request.UpdateUserRequest;
import com.auth.server.Dto.Response.UserResponse;
import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Entity.AuthRole;
import com.auth.server.Entity.EmailVerificationToken;
import com.auth.server.Exceptions.ResourceNotFoundException;
import com.auth.server.Repository.AuthIdentityRepository;
import com.auth.server.Repository.AuthRoleRepository;
import com.auth.server.Repository.EmailVerificactionRepository;
import com.auth.server.infrastructure.email.EmailService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthUserService {
    private final AuthIdentityRepository authIdentityRepository;
    private final AuthRoleRepository authRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificactionRepository verificationRepository;
    private final EmailService emailService;
    private final UserSyncNotificationService userSyncNotificationService;

    @Transactional
    public void registerUser(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (authIdentityRepository.findByEmail(email).isPresent()) {
            throw new ValidationException("Este correo ya está vinculado a otra cuenta");
        }

        AuthRole role = authRoleRepository.findByName(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + request.role()));

        AuthIdentity identity = AuthIdentity.builder()
                .userUuid(UUID.randomUUID())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .enabled(false)
                .emailVerified(false)
                .roles(Set.of(role))
                .build();

        authIdentityRepository.save(identity);

        String token = UUID.randomUUID().toString();
        verificationRepository.save(EmailVerificationToken.builder()
                .token(token)
                .authIdentity(identity)
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .createdAt(LocalDateTime.now())
                .used(false)
                .build());

        emailService.sendVerificationEmail(email, token);
        log.info("Usuario registrado: {} con rol: {}", email, request.role());
    }

    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken verificationToken = verificationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Token inválido"));

        if (verificationToken.isUsed()) {
            // Si la cuenta ya está activa, es un doble-click o retry — no es un error real
            AuthIdentity identity = verificationToken.getAuthIdentity();
            if (identity.isEnabled() && identity.isEmailVerified()) {
                log.info("Token ya usado pero cuenta activa, ignorando re-verificación: {}", identity.getEmail());
                return; // ← silencioso, el frontend recibirá 200
            }
            throw new ValidationException("Este token ya fue usado");
        }

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ValidationException("Este token ha expirado");
        }

        AuthIdentity identity = verificationToken.getAuthIdentity();
        identity.setEnabled(true);
        identity.setEmailVerified(true);
        verificationToken.setUsed(true);

        authIdentityRepository.save(identity);
        verificationRepository.save(verificationToken);

        userSyncNotificationService.notifyBusinessApi(identity);
        log.info("Email verificado para usuario: {}", identity.getEmail());
    }

    @Transactional
    public UserResponse updateProfile(UUID userUuid, UpdateUserRequest request) {
        AuthIdentity identity = authIdentityRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (request.firstName() != null && !request.firstName().isBlank()) {
            identity.setFirstName(request.firstName());
        }
        if (request.lastName() != null && !request.lastName().isBlank()) {
            identity.setLastName(request.lastName());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            identity.setPhone(request.phone());
        }

        AuthIdentity updated = authIdentityRepository.save(identity);
        userSyncNotificationService.notifyBusinessApi(updated);

        log.info("Usuario {} actualizado", userUuid);
        return UserResponse.from(updated);
    }
}





package com.auth.server.Service;

import com.auth.server.Dto.Request.ChangePasswordRequest;
import com.auth.server.Dto.Request.ForgotPasswordRequest;
import com.auth.server.Dto.Request.ResetPasswordRequest;
import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Entity.PasswordResetToken;
import com.auth.server.Exceptions.ResourceNotFoundException;
import com.auth.server.Repository.AuthIdentityRepository;
import com.auth.server.Repository.OAuth2AuthorizationJdbcRepository;
import com.auth.server.Repository.PasswordResetTokenRepository;
import com.auth.server.infrastructure.email.EmailService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordManagementService {
    private final AuthIdentityRepository authIdentityRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final OAuth2AuthorizationJdbcRepository authorizationRepository;

    // ── Recuperación de contraseña ───────────────────────────────────────────

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.email().trim().toLowerCase();

        authIdentityRepository.findByEmail(email).ifPresent(user -> {
            String otp = generateOtp();

            resetTokenRepository.save(PasswordResetToken.builder()
                    .email(email)
                    .otpHash(passwordEncoder.encode(otp))
                    .createdAt(LocalDateTime.now())
                    .expiredAt(LocalDateTime.now().plusMinutes(5))
                    .used(false)
                    .build());

            emailService.sendOtpPasswordReset(email, otp);
            log.info("OTP de recuperación enviado a: {}", email);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = request.email().trim().toLowerCase();

        AuthIdentity identity = authIdentityRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Correo no encontrado"));

        PasswordResetToken resetToken = resetTokenRepository
                .findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró código emitido para este correo"));

        if (resetToken.isUsed()) {
            throw new ValidationException("El código ya fue usado");
        }
        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new ValidationException("El código ha expirado");
        }
        if (resetToken.getAttempts() >= 5) {
            throw new ValidationException("Has superado el límite de intentos");
        }
        if (!passwordEncoder.matches(request.otp(), resetToken.getOtpHash())) {
            resetToken.setAttempts(resetToken.getAttempts() + 1);
            resetTokenRepository.save(resetToken);
            throw new ValidationException("Código inválido");
        }

        identity.setPassword(passwordEncoder.encode(request.newPassword()));
        authIdentityRepository.save(identity);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);

        log.info("Contraseña restablecida para: {}", email);
    }

    // ── Cambio de contraseña ─────────────────────────────────────────────────

    @Transactional
    public void changePassword(String userUuid, ChangePasswordRequest request) {
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new ValidationException("Las contraseñas no coinciden");
        }

        AuthIdentity identity = authIdentityRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.currentPassword(), identity.getPassword())) {
            throw new ValidationException("Contraseña actual incorrecta");
        }
        if (passwordEncoder.matches(request.newPassword(), identity.getPassword())) {
            throw new ValidationException("La nueva contraseña no puede ser igual a la anterior");
        }

        identity.setPassword(passwordEncoder.encode(request.newPassword()));
        authIdentityRepository.save(identity);

        authorizationRepository.deleteByPrincipalName(identity.getEmail());
        log.info("Contraseña cambiada para usuario: {}", userUuid);
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private String generateOtp() {
        return String.valueOf(new SecureRandom().nextInt(900000) + 100000);
    }
}

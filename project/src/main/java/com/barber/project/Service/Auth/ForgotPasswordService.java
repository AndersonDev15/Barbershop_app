package com.barber.project.Service.Auth;

import com.barber.project.Entity.PasswordResetToken;
import com.barber.project.Entity.User;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.PasswordResetTokenRepository;
import com.barber.project.Repository.UserRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ForgotPasswordService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;


    private static final int MAX_ATTEMPTS = 5;
    private static final int BLOCK_MINUTES = 15;




    //duracion del codigo
    private static final long EXPIRATION_MINUTES = 10;


    @Transactional
    public void validatePasswordAndSendCode(String currentPassword) {
        User user = getAuthenticatedUsername();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ValidationException("La contraseña actual es incorrecta");
        }

        // borrar si hay un código previo
        passwordResetTokenRepository.deleteByUser(user);

        // generar código de 6 dígitos
        String code = String.format("%06d", new Random().nextInt(999999));

        // crear token con expiración
        PasswordResetToken token = new PasswordResetToken(
                null,
                code,
                LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES),
                user
        );
        passwordResetTokenRepository.save(token);

        // enviar correo
        String subject = "Código de recuperación de contraseña";
        String body = "Hola " + user.getFirstName() +
                "\n\nTu código de recuperación es " + code +
                ". Este código expira en " + EXPIRATION_MINUTES + " minutos.";
        emailService.sendEmail(user.getEmail(), subject, body);
    }

    @Transactional
    public PasswordResetToken validateCode(String code) {
        // buscar el código
        PasswordResetToken token = passwordResetTokenRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Código inválido"));

        // verificación de expiración
        if (token.getExpiration().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(token);
            throw new ValidationException("El código ha expirado");
        }

        return token;
    }

    @Transactional
    public void ResetPassword(String code, String newPassword){
        PasswordResetToken token = validateCode(code);
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setLastPasswordChange(LocalDateTime.now());
        userRepository.save(user);

        //borrar token
        passwordResetTokenRepository.delete(token);
    }



    private User getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));
    }



}

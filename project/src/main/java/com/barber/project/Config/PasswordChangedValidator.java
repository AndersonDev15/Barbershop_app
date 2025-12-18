package com.barber.project.Config;

import com.barber.project.Entity.User;
import com.barber.project.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

@RequiredArgsConstructor
public class PasswordChangedValidator implements OAuth2TokenValidator<Jwt> {

    private final UserRepository userRepository;

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        try {
            String email = jwt.getSubject();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new OAuth2AuthenticationException("Usuario no encontrado")
                    );

            Long tokenPwdChanged = jwt.getClaim("passwordChangedAt");

            if (tokenPwdChanged == null) {
                return invalid("Token sin fecha de cambio de contraseña");
            }

            Instant tokenInstant = Instant.ofEpochSecond(tokenPwdChanged);
            Instant dbInstant = user.getLastPasswordChange()
                    .truncatedTo(ChronoUnit.SECONDS)
                    .atZone(ZoneOffset.UTC)
                    .toInstant();

            if (tokenInstant.isBefore(dbInstant)) {
                return invalid("Token revocado por cambio de contraseña");
            }

            return OAuth2TokenValidatorResult.success();

        } catch (Exception e) {
            return invalid("Error al validar token: " + e.getMessage());
        }
    }

    private OAuth2TokenValidatorResult invalid(String message) {
        return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token", message, null)
        );
    }
}

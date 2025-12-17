package com.barber.project.Config;

import com.barber.project.Entity.User;
import com.barber.project.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDateTime;

@RequiredArgsConstructor
public class PasswordChangedValidator implements OAuth2TokenValidator<Jwt> {
    private final UserRepository userRepository;

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt){
        try{
            String email = jwt.getSubject();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new OAuth2AuthenticationException("Usuario no encontrado"));
            String tokenDateStr = jwt.getClaim("passwordChangedAt");
            if (tokenDateStr == null) {
                return invalid("Token sin fecha de cambio de contraseña");
            }
            LocalDateTime tokenDate = LocalDateTime.parse(tokenDateStr);
            if (tokenDate.isBefore(user.getLastPasswordChange())) {
                return invalid("Token revocado por cambio de contraseña");
            }
            return OAuth2TokenValidatorResult.success();
        }catch (Exception e){
            return invalid("Error al validar token: " + e.getMessage());
        }
    }

    private OAuth2TokenValidatorResult invalid(String message){
        return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token",message,null));
    }
}

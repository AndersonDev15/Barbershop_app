package com.auth.server.Handler;

import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Repository.AuthIdentityRepository;
import com.auth.server.Repository.FederatedIdentityRepository;
import com.auth.server.Service.FederatedIdentityService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class FederatedIdentityAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final FederatedIdentityService federatedIdentityService;
    private final AuthIdentityRepository authIdentityRepository;
    private final AuthenticationSuccessHandler delegate =
            new SavedRequestAwareAuthenticationSuccessHandler();


    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
            OAuth2User oAuth2User = oauth2Token.getPrincipal();
            String email = oAuth2User.getAttribute("email");
            String givenName = oAuth2User.getAttribute("given_name");
            String familyName = oAuth2User.getAttribute("family_name");
            Boolean emailVerified = oAuth2User.getAttribute("email_verified");
            String provider = oauth2Token.getAuthorizedClientRegistrationId();
            String providerId = oAuth2User.getAttribute("sub");

            log.info("Usuario autenticado con {}: {}", provider, email);

            //buscar o crear el usuario
            AuthIdentity authIdentity = authIdentityRepository.findByEmail(email)
                    .orElseGet(()->{
                        log.info("Creando nuevo usuario desde Google: {}", email);
                        return federatedIdentityService.createFromGoogle(
                                email,
                                givenName,
                                familyName,
                                emailVerified,
                                providerId
                        );
                    });
            // Verificar si es la primera vez que usa este proveedor
            federatedIdentityService.linkProviderIfNeeded(
                    authIdentity,
                    provider,
                    providerId
            );

        }
        delegate.onAuthenticationSuccess(request,response,authentication);

    }
}

package com.auth.server.Config;

import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;


@Configuration
public class ClientInitConfig {

    @Value("${app.redirect-uri:http://127.0.0.1:8090/login/oauth2/code/barberia-client}")
    private String redirectUri;

    @Bean
    CommandLineRunner initClients(RegisteredClientRepository repo, PasswordEncoder passwordEncoder) {
        return args -> {

            if (repo.findByClientId("barberia-client") != null) {
                return;
            }

            RegisteredClient client =
                    RegisteredClient.withId(UUID.randomUUID().toString())
                            .clientId("barberia-client")
                            .clientSecret(passwordEncoder.encode("123456"))
                            .clientName("Barbería Frontend")
                            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                            .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                            .redirectUri(redirectUri)
                            .postLogoutRedirectUri("http://127.0.0.1:5173/login")// ✅ configurable via env
                            .scope(OidcScopes.OPENID)
                            .scope(OidcScopes.PROFILE)
                            .scope("read")
                            .scope("write")
                            .clientSettings(ClientSettings.builder()
                                    .requireProofKey(true)
                                    .requireAuthorizationConsent(false)
                                    .build())
                            .tokenSettings(TokenSettings.builder()
                                    .accessTokenTimeToLive(Duration.ofMinutes(200))
                                    .refreshTokenTimeToLive(Duration.ofHours(8))
                                    .reuseRefreshTokens(false)
                                    .build())
                            .build();

            repo.save(client);
        };
    }
}
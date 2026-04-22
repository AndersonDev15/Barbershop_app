package com.auth.server.Config;

import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Entity.AuthRole;
import com.auth.server.Exceptions.JwtAccessDeniedHandler;
import com.auth.server.Exceptions.JwtAuthEntryPoint;
import com.auth.server.Handler.FederatedIdentityAuthenticationSuccessHandler;
import com.auth.server.Repository.AuthIdentityRepository;
import com.auth.server.Repository.FederatedIdentityRepository;
import com.auth.server.Security.AuthUserDetailsService;
import com.auth.server.Service.FederatedIdentityService;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.authorization.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.oidc.authentication.OidcUserInfoAuthenticationContext;
import org.springframework.security.oauth2.server.authorization.oidc.authentication.OidcUserInfoAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.auth.server.Security.InternalApiKeyFilter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AuthorizationSecurityConfig {

    private final AuthUserDetailsService authUserDetailsService;
    private final AuthIdentityRepository authIdentityRepository;
    private final FederatedIdentityRepository federatedIdentityRepository;
    private final FederatedIdentityService federatedIdentityService;
    private final InternalApiKeyFilter internalApiKeyFilter;

    @Bean
    @Order(1)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http) throws Exception {

        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer =
                new OAuth2AuthorizationServerConfigurer();

        http.securityMatcher(authorizationServerConfigurer.getEndpointsMatcher())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/oauth2/token").permitAll()
                        .requestMatchers("/connect/logout").permitAll()  // ✅ Agregar esto
                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.ignoringRequestMatchers(authorizationServerConfigurer.getEndpointsMatcher()))
                .apply(authorizationServerConfigurer)
                .oidc(oidc -> oidc
                        .userInfoEndpoint(userInfo -> userInfo.userInfoMapper(this::mapUserInfo))
                        // ✅ Agregar esto:
                        .logoutEndpoint(Customizer.withDefaults())
                        .clientRegistrationEndpoint(Customizer.withDefaults())
                );

        http.exceptionHandling(exceptions -> exceptions
                .defaultAuthenticationEntryPointFor(
                        new LoginUrlAuthenticationEntryPoint("/login"),
                        new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
                )
        );

        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    private OidcUserInfo mapUserInfo(OidcUserInfoAuthenticationContext context) {
        String principalName = context.getAuthorization().getPrincipalName();

        AuthIdentity identity = authIdentityRepository.findByEmail(principalName)
                .orElseGet(() -> federatedIdentityRepository
                        .findAuthIdentityByProviderId(principalName)
                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + principalName))
                );

        // Agregar después de los claims existentes
        boolean isGoogleUser = identity.getPassword() == null;


        List<String> roles = identity.getRoles().stream()
                .map(AuthRole::getName)
                .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                .toList();

        Map<String, Object> claims = new HashMap<>();

        claims.put("sub", identity.getUserUuid());
        claims.put("email", identity.getEmail());
        claims.put("given_name", identity.getFirstName());
        claims.put("family_name", identity.getLastName());
        claims.put("phone_number", identity.getPhone());
        claims.put("roles", roles);
        claims.put("is_google_user", isGoogleUser);

        return new OidcUserInfo(claims);
    }
    @Bean
    @Order(2)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http,
                                                      JwtAuthEntryPoint jwtAuthEntryPoint,
                                                      JwtAccessDeniedHandler jwtAccessDeniedHandler) throws Exception {
        http
                .securityMatcher("/api/**", "/admin/**")  // Solo para endpoints /api/**
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/admin/**").permitAll()
                        .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable)
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults())
                        .authenticationEntryPoint(jwtAuthEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler));

        return http.build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain internalApiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/internal/**")
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                )
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(internalApiKeyFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    @Order(4)
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http)
            throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .permitAll()
                )
                .oauth2Login(oauth2Login -> oauth2Login
                        .loginPage("/login")
                        .successHandler(federatedIdentityAuthenticationSuccessHandler())
                )
                .userDetailsService(authUserDetailsService);

        return http.build();
    }

    // Handler para procesar login de Google

    public AuthenticationSuccessHandler federatedIdentityAuthenticationSuccessHandler() {
        return new FederatedIdentityAuthenticationSuccessHandler(
                federatedIdentityService,
                authIdentityRepository
        );
    }

    //auth server setting
    @Bean
    AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
                .issuer("http://127.0.0.1:9000")
                .build();
    }



    @Bean
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> tokenCustomizer(
            AuthIdentityRepository authIdentityRepository) {

        return context -> {

            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType()) ||
                    "id_token".equals(context.getTokenType().getValue())) {

                Authentication authentication = context.getPrincipal();
                String email;

                // Extraer email según el tipo de autenticación
                if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
                    OAuth2User oauth2User = oauth2Token.getPrincipal();
                    email = oauth2User.getAttribute("email");

                    if (email == null) {
                        throw new IllegalStateException("Email no encontrado en OAuth2User");
                    }
                } else {
                    // Login tradicional
                    email = authentication.getName();
                }

                // Buscar usuario en BD
                AuthIdentity identity = authIdentityRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalStateException(
                                "Usuario no encontrado en BD: " + email));

                // Normalizar sub al UUID interno
                context.getClaims().subject(identity.getUserUuid());

                // Agregar user_uuid (opcional porque ya está en sub, pero útil)
                context.getClaims().claim("user_uuid", identity.getUserUuid());
                context.getClaims().claim("email",identity.getEmail());


                // Roles desde BD
                List<String> roles = identity.getRoles().stream()
                        .map(AuthRole::getName)
                        .map(roleName -> roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName)
                        .collect(Collectors.toList());

                context.getClaims().claim("roles", roles);

            }
        };
    }

}

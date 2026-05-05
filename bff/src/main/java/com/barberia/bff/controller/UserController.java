package com.barberia.bff.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final WebClient webClient;

    @GetMapping("/auth/me")
    public Mono<Map<String, Object>> me(
            @AuthenticationPrincipal OidcUser user,
            @RegisteredOAuth2AuthorizedClient("barberia-client") OAuth2AuthorizedClient authorizedClient) {

        String token = authorizedClient.getAccessToken().getTokenValue();

        return webClient.get()
                .uri("/api/barbershop/my")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(Map.class)
                .map(shop -> buildResponse(user, shop))
                .onErrorResume(e -> Mono.just(buildResponse(user, null)));
    }

    @GetMapping("/userinfo")
    public Mono<Map<String, Object>> userInfo(@AuthenticationPrincipal OidcUser user) {
        List<String> roles = user.getClaimAsStringList("roles");
        Boolean isGoogleUser = user.getClaim("is_google_user");

        return Mono.just(Map.of(
                "sub",          user.getSubject(),
                "name",         user.getFullName()            != null ? user.getFullName()            : "",
                "email",        user.getEmail()               != null ? user.getEmail()               : "",
                "roles",        roles                         != null ? roles                         : List.of(),
                "given_name",   user.getGivenName()           != null ? user.getGivenName()           : "",
                "family_name",  user.getFamilyName()          != null ? user.getFamilyName()          : "",
                "phone_number", user.getClaim("phone_number") != null ? user.getClaim("phone_number") : "",
                "is_google_user", isGoogleUser != null ? isGoogleUser : false
        ));
    }

    @GetMapping("/auth/status")
    public Mono<Map<String, Object>> authStatus(@AuthenticationPrincipal OidcUser user) {
        if (user == null) return Mono.just(Map.of("authenticated", false));
        return Mono.just(Map.of(
                "authenticated", true,
                "name",  user.getFullName() != null ? user.getFullName() : "",
                "roles", user.getClaimAsStringList("roles") != null
                        ? user.getClaimAsStringList("roles") : List.of()
        ));
    }

    private Map<String, Object> buildResponse(OidcUser user, Map shop) {
        Map<String, Object> response = new HashMap<>();
        response.put("sub",          user.getSubject());
        response.put("email",        user.getEmail()               != null ? user.getEmail()               : "");
        response.put("given_name",   user.getGivenName()           != null ? user.getGivenName()           : "");
        response.put("family_name",  user.getFamilyName()          != null ? user.getFamilyName()          : "");
        response.put("phone_number", user.getClaim("phone_number") != null ? user.getClaim("phone_number") : "");
        response.put("roles",        user.getClaimAsStringList("roles") != null ? user.getClaimAsStringList("roles") : List.of());

        if (shop != null) {
            response.put("barberShopName", shop.get("barberShopName"));
            response.put("address",        shop.get("address"));
            response.put("city",           shop.get("city"));
            response.put("department",     shop.get("department"));
            response.put("phone",          shop.get("phone"));
            response.put("shopId",         shop.get("id"));
            response.put("status",         shop.get("status"));
            response.put("coverImageUrl", shop.get("coverImageUrl"));
        }

        return response;
    }
}
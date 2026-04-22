package com.barberia.bff.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/client/barbershops")
@RequiredArgsConstructor
public class ClientBarbershopController {

    private final WebClient webClient;

    @GetMapping("/{id}/full")
    public Mono<Map<String, Object>> getFullBarbershop(
            @PathVariable Long id,
            @RegisteredOAuth2AuthorizedClient("barberia-client")
            OAuth2AuthorizedClient authorizedClient
    ) {

        String token = authorizedClient.getAccessToken().getTokenValue();

        // 1. Info base (incluye coverImageUrl)
        Mono<Map> shopMono = webClient.get()
                .uri("/api/client/barbershops/{id}", id)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(Map.class);

        // 2. Barberos
        Mono<Map> barbersMono = webClient.get()
                .uri("/api/client/barbershops/{id}/barbers", id)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(Map.class);

        // 3. Servicios
        Mono<List> servicesMono = webClient.get()
                .uri("/api/client/barbershops/{id}/services", id)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(List.class);

        return Mono.zip(shopMono, barbersMono, servicesMono)
                .map(tuple -> {

                    Map<String, Object> shop = tuple.getT1();
                    Map<String, Object> barbersPage = tuple.getT2();
                    List<?> services = tuple.getT3();

                    Map<String, Object> response = new HashMap<>();

                    // info completa
                    response.put("info", shop);

                    // solo el content (no toda la paginación)
                    response.put("barbers", barbersPage.get("content"));

                    response.put("services", services);

                    return response;
                });
    }

    @GetMapping("/search")
    public Mono<List<Map<String, Object>>> searchBarberShop(
            @RequestParam String name,
            @RegisteredOAuth2AuthorizedClient("barberia-client")
            OAuth2AuthorizedClient authorizedClient
    ) {
        String token = authorizedClient.getAccessToken().getTokenValue();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/client/barbershops/search")
                        .queryParam("name", name)
                        .build()
                )
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .onStatus(
                        status -> status.value() == 404,
                        response -> Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND))
                )
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {});
    }

    @GetMapping("/barber/{barberId}/availability")
    public Mono<Map<String, Object>> getBarberAvailability(
            @PathVariable Long barberId,
            @RequestParam String date,
            @RegisteredOAuth2AuthorizedClient("barberia-client")
            OAuth2AuthorizedClient authorizedClient
    ) {
        String token = authorizedClient.getAccessToken().getTokenValue();
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/barbershop/barber/{barberId}/availability")
                        .queryParam("date", date)
                        .build(barberId)
                )
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    @GetMapping("/{barbershopId}/services/{categoryId}/subcategories")
    public Mono<List<Map<String, Object>>> getSubcategories(
            @PathVariable Long barbershopId,
            @PathVariable Long categoryId,
            @RegisteredOAuth2AuthorizedClient("barberia-client")
            OAuth2AuthorizedClient authorizedClient
    ) {
        String token = authorizedClient.getAccessToken().getTokenValue();
        return webClient.get()
                .uri("/api/client/barbershops/{barbershopId}/services/{categoryId}/subcategories",
                        barbershopId, categoryId)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {});
    }

    @PostMapping("/availability/search")
    public Mono<Map<String, Object>> searchAvailability(
            @RequestBody Map<String, Object> body,
            @RegisteredOAuth2AuthorizedClient("barberia-client")
            OAuth2AuthorizedClient authorizedClient
    ) {
        String token = authorizedClient.getAccessToken().getTokenValue();
        return webClient.post()
                .uri("/api/client/availability/search")
                .header("Authorization", "Bearer " + token)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }
}

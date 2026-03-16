package com.auth.server.Config;

import feign.Logger;
import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de Feign Client para Business API
 */
@Configuration
@Slf4j
public class BusinessApiFeignConfig {

    @Value("${business.api.api-key}")
    private String apiKey;

    /**
     * Interceptor para agregar API Key a todas las requests
     */
    @Bean
    public RequestInterceptor businessApiKeyInterceptor() {
        return requestTemplate -> {
            log.debug("Agregando API Key a request: {}", requestTemplate.url());
            requestTemplate.header("X-API-Key", apiKey);
        };
    }

    /**
     * Manejo de errores personalizado
     */
    @Bean
    public ErrorDecoder businessApiErrorDecoder() {
        return (methodKey, response) -> {
            log.error("Error en Business API: {} - {} - {}",
                    methodKey,
                    response.status(),
                    response.reason()
            );

            return switch (response.status()) {
                case 401 -> new RuntimeException("API Key no proporcionada a Business API");
                case 403 -> new RuntimeException("API Key inválida en Business API");
                case 404 -> new RuntimeException("Endpoint no encontrado en Business API");
                case 500, 503 -> new RuntimeException("Business API no disponible");
                default -> new RuntimeException("Error en Business API: " + response.status());
            };
        };
    }

    /**
     * Nivel de logs de Feign
     */
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.BASIC;  // NONE, BASIC, HEADERS, FULL
    }
}
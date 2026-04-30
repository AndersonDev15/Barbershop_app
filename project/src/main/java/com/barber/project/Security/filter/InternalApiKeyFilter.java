package com.barber.project.Security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.barber.project.Security.Config.InternalApiProperties;
import java.io.IOException;
import java.util.Map;

/**
 * Filtro de seguridad para validar API Keys en endpoints internos.
 *
 * Solo se aplica a rutas que empiezan con /internal/**
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InternalApiKeyFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-Key"; 

    private final InternalApiProperties properties;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Solo aplicar a endpoints /internal/**
        if (!requestPath.startsWith("/internal/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiKey = request.getHeader(API_KEY_HEADER);

        // Validar que exista el header
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Intento de acceso sin API Key a {} desde IP: {}",
                    requestPath,
                    request.getRemoteAddr()
            );
            respondError(response, HttpServletResponse.SC_UNAUTHORIZED, "API Key requerida");
            return;
        }

        // Validar que la key sea válida
        Map<String, String> validApiKeys = properties.getKeys();

        log.info("Request a: {}", requestPath);
        log.info("API Key recibida: [{}]", apiKey);
        log.info("API Keys válidas configuradas: {}", validApiKeys);

        if (validApiKeys == null || !validApiKeys.containsValue(apiKey)) {
            log.warn("API Key inválida para {} desde IP: {}",
                    requestPath,
                    request.getRemoteAddr()
            );
            respondError(response, HttpServletResponse.SC_FORBIDDEN, "API Key inválida");
            return;
        }

        // Identificar cliente para auditoría
        String clientName = validApiKeys.entrySet().stream()
                .filter(entry -> entry.getValue().equals(apiKey))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse("unknown");

        log.debug("Acceso autorizado a {} por cliente: {}", requestPath, clientName);

        // Agregar información del cliente al request (para auditoría en controllers)
        request.setAttribute("api.client.name", clientName);

        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    private void respondError(HttpServletResponse response, int status, String message)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                String.format("{\"error\":\"%s\",\"status\":%d}", message, status)
        );
    }
}

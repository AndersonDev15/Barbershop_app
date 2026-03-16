package com.auth.server.security;

import com.auth.server.Config.InternalApiProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;


/**
 * Filtro de seguridad para validar API Keys en endpoints internos.
 *
 * Solo se aplica a rutas que empiezan con /internal/**
 * Valida el header X-API-Key contra las keys configuradas.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InternalApiKeyFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-Api-Key";
    private final InternalApiProperties internalApiProperties;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();


        if (!requestPath.startsWith("/internal/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiKey = request.getHeader(API_KEY_HEADER);

        //validar que el header exista
        if(apiKey==null || apiKey.isBlank()){
            log.warn("Intento de acceso sin API Key a {} desde IP: {}",
                    requestPath,
                    request.getRemoteAddr());
            respondError(response, HttpServletResponse.SC_UNAUTHORIZED, "API Key requerida");
            return;
        }

        //validar que la key sea valida
        Map<String, String> validApiKeys = internalApiProperties.getKeys();

        if (validApiKeys == null || validApiKeys.isEmpty()) {
            log.error("No hay API keys configuradas para endpoints internos");
            respondError(response,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Configuración interna inválida");
            return;
        }

        String clientName = validApiKeys.entrySet().stream()
                .filter(entry -> entry.getValue().equals(apiKey))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);

        if (clientName == null) {
            log.warn("API Key inválida para {} desde IP: {}",
                    requestPath,
                    request.getRemoteAddr());

            respondError(response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "API Key inválida");
            return;
        }

        log.debug("Acceso autorizado a {} por cliente: {}", requestPath, clientName);


        request.setAttribute("api.client.name", clientName);

        filterChain.doFilter(request, response);
    }

    /**
     * Método helper para responder con error JSON
     */
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
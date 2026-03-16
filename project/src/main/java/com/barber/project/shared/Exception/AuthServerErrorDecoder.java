package com.barber.project.shared.Exception;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AuthServerErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("Error calling Auth Server: {} - {}",
                response.status(),
                response.reason());

        return switch (response.status()) {
            case 401 -> new RuntimeException("API Key no proporcionada al Auth Server");
            case 403 -> new RuntimeException("API Key inválida o rechazada por Auth Server");
            case 404 -> new ResourceNotFoundException("Recurso no encontrado en Auth Server");
            case 500, 503 -> new RuntimeException("Auth Server no disponible");
            default -> defaultDecoder.decode(methodKey, response);
        };
    }
}

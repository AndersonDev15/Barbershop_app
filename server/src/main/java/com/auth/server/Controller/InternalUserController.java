package com.auth.server.Controller;

import com.auth.server.Dto.Response.UserSummaryResponse;
import com.auth.server.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("internal/users")
@RequiredArgsConstructor
@Slf4j
public class InternalUserController {

    private final UserService userService;

    /**
     * Endpoint interno: obtener usuarios por UUIDs en batch
     * POST /internal/users/batch
     * Header: X-API-Key: <api-key>
     * Body: ["uuid1", "uuid2", "uuid3"]
     */
    @PostMapping("/batch")
    public List<UserSummaryResponse> getUsersByUuids(
            @RequestBody @NotEmpty List<@NotBlank UUID> uuids,
            HttpServletRequest request
    ){

        // Obtener cliente que llamó (del filtro)
        String apiClient = (String) request.getAttribute("api.client.name");

        log.info("Batch request de {} usuarios por cliente: {}",
                uuids != null ? uuids.size() : 0,
                apiClient
        );

        if (uuids.size() > 100) {
            throw new IllegalArgumentException(
                    "No se pueden solicitar más de 100 usuarios a la vez"
            );
        }

        List<UserSummaryResponse> users = userService.findByUuids(uuids);

        return users;

    }
}

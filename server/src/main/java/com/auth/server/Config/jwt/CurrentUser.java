package com.auth.server.Config.jwt;

import java.util.Set;
import java.util.UUID;

public record CurrentUser(
        UUID userUuid,
        String email,
        Set<UserRole> roles
) {

    public boolean hasRole(UserRole role) {
        return roles != null && roles.contains(role);
    }

    public boolean isCliente() {
        return hasRole(UserRole.CLIENTE);
    }

    public boolean isBarbero() {
        return hasRole(UserRole.BARBERO);
    }

    public boolean isBarberia() {
        return hasRole(UserRole.BARBERIA);
    }
}

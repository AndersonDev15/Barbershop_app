package com.barber.project.Security.Jwt;

import java.util.List;
import java.util.Set;

public record CurrentUser(
        String userUuid,
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
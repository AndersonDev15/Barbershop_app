package com.auth.server.Config.jwt;

import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public final class CurrentUserMapper {

    private CurrentUserMapper() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static CurrentUser fromJwt(Jwt jwt) {

        var roleStrings = jwt.getClaimAsStringList("roles");

        Set<UserRole> roles = roleStrings == null
                ? Set.of()
                : roleStrings.stream()
                .map(role -> role.replace("ROLE_", ""))
                .map(UserRole::valueOf)
                .collect(Collectors.toSet());

        UUID userUuid;
        try {
            userUuid = UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid UUID in JWT subject");
        }

        return new CurrentUser(
                userUuid,
                jwt.getClaimAsString("email"),
                roles
        );
    }
}

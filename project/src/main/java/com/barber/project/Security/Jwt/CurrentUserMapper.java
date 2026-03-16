package com.barber.project.Security.Jwt;

import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Optional;
import java.util.Set;
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

        return new CurrentUser(
                jwt.getSubject(),
                jwt.getClaimAsString("email"),
                roles
        );
    }
}

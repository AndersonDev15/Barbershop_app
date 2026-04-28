package com.auth.server.Repository;

import com.auth.server.Entity.AuthIdentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuthIdentityRepository extends JpaRepository<AuthIdentity, Long> {

    Optional<AuthIdentity> findByEmail(String email);

    Optional<AuthIdentity> findByUserUuid(UUID userUuid);

    List<AuthIdentity> findByUserUuidIn(List<UUID> userUuids);

    /**
     * Encontrar usuarios habilitados y verificados
     */
    List<AuthIdentity> findByEnabledTrueAndEmailVerifiedTrue();

    @Query("""
        SELECT a FROM AuthIdentity a
        WHERE a.enabled = true
        AND a.emailVerified = true
        AND (
            a.updatedAt > :since
            OR a.lastSyncedAt IS NULL
        )
        """)
    List<AuthIdentity> findPendingSync(@Param("since") LocalDateTime since);
}

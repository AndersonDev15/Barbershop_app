package com.barber.project.user.repository;

import com.barber.project.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User>findByUserUuid(UUID userUuid);
    List<User> findByUserUuidIn(List<UUID> userUuids);

    /**
     * Encontrar usuarios no sincronizados recientemente
     */
    @Query("SELECT u FROM User u WHERE u.lastSyncedAt < :threshold")
    List<User>findStaleUsers(@Param("threshold")Instant threshold);

    boolean existsByUserUuid(UUID userUuid);

}

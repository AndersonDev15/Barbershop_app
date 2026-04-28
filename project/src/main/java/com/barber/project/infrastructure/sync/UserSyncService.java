package com.barber.project.infrastructure.sync;

import com.barber.project.infrastructure.sync.dto.UserSyncRequest;
import com.barber.project.user.entity.User;
import com.barber.project.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSyncService {

    private final UserRepository userRepository;

    /*
    * Sincronizar un usuario desde Auth server
     */
    @Transactional
    public User syncUser(UserSyncRequest request){
        log.info("sincronizando usuario: {} ({})",
                request.getUserUuid(),
                request.getEmail());

        User user = userRepository.findByUserUuid(request.getUserUuid())
                .orElse(new User());

        user.setUserUuid(request.getUserUuid());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setLastSyncedAt(Instant.now());

        User saved = userRepository.save(user);
        log.info("Usuario {} sincronizado: {} {}",
                saved.getUserUuid(),
                saved.getFirstName(),
                saved.getLastName()
        );

        return saved;

    }

    /**
     * Obtener usuario del cache local
     */
    @Transactional(readOnly = true)
    public User getUser(UUID userUuid) {
        return userRepository.findByUserUuid(userUuid)
                .orElse(null);
    }

    /**
     * Obtener múltiples usuarios del cache local
     */
    @Transactional(readOnly = true)
    public List<User> getUsers(List<UUID> userUuids) {
        return userRepository.findByUserUuidIn(userUuids);
    }

    /**
     * Verificar si un usuario existe en el cache
     */
    public boolean exists(UUID userUuid) {
        return userRepository.existsByUserUuid(userUuid);
    }

    /**
     * Obtener usuarios no sincronizados recientemente (para job de reconciliación)
     */
    @Transactional(readOnly = true)
    public List<User> getStaleUsers(int days) {
        Instant threshold = Instant.now().minus(days, ChronoUnit.DAYS);
        return userRepository.findStaleUsers(threshold);
    }
}

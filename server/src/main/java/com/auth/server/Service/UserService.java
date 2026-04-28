package com.auth.server.Service;

import com.auth.server.Dto.Response.UserSummaryResponse;
import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Repository.AuthIdentityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final AuthIdentityRepository identityRepository;

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> findByUuids(List<UUID> uuids){
        log.debug("Buscando {} usuarios", uuids.size());

        List<AuthIdentity> identities = identityRepository.findByUserUuidIn(uuids);

        log.debug("Encontrados {} usuarios de {} solicitados", identities.size(), uuids.size());

        return identities.stream()
                .map(user -> new UserSummaryResponse(
                        user.getUserUuid(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getPhone()
                ))
                .toList();

    }
}

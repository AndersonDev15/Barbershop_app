package com.auth.server.Service;

import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Entity.AuthRole;
import com.auth.server.Entity.FederatedIdentity;
import com.auth.server.Exceptions.ResourceNotFoundException;
import com.auth.server.Repository.AuthIdentityRepository;
import com.auth.server.Repository.AuthRoleRepository;
import com.auth.server.Repository.FederatedIdentityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FederatedIdentityService {

    private final AuthIdentityRepository authIdentityRepository;
    private final AuthRoleRepository authRoleRepository;
    private final FederatedIdentityRepository federatedIdentityRepository;
    private final UserSyncNotificationService userSyncNotificationService;

    public AuthIdentity createFromGoogle(
            String email,
            String givenName,
            String familyName,
            Boolean emailVerified,
            String providedId
    ){
        AuthRole authRole = authRoleRepository.findByName("CLIENTE")
                .orElseThrow(()->new ResourceNotFoundException("Rol no encontrado"));

        AuthIdentity authIdentity = AuthIdentity.builder()
                .userUuid(UUID.randomUUID().toString())
                .email(email.toLowerCase().trim())
                .firstName(givenName)
                .lastName(familyName)
                .password("{noop}N/A")
                .phone(null)
                .enabled(true)
                .emailVerified(emailVerified != null ? emailVerified : null)
                .roles(Set.of(authRole))
                .build();

       AuthIdentity saved =  authIdentityRepository.save(authIdentity);

        //crear enlace con google
        FederatedIdentity identity = FederatedIdentity.builder()
                .authIdentity(authIdentity)
                .provider("google")
                .providerId(providedId)
                .providerEmail(email)
                .build();

        federatedIdentityRepository.save(identity);

        log.info("Usuario creado desde Google: {} ({})", email, authIdentity.getUserUuid());
        userSyncNotificationService.notifyBusinessApi(saved);
        return authIdentity;
    }

    public void linkProviderIfNeeded(
            AuthIdentity identity,
            String provider,
            String providerId) {

        boolean exists = federatedIdentityRepository
                .existsByAuthIdentityAndProvider(identity, provider);

        if (!exists) {
            FederatedIdentity federatedIdentity = FederatedIdentity.builder()
                    .authIdentity(identity)
                    .provider(provider)
                    .providerId(providerId)
                    .providerEmail(identity.getEmail())
                    .build();

            federatedIdentityRepository.save(federatedIdentity);

            log.info("Proveedor {} vinculado a usuario {}", provider, identity.getEmail());
        }
    }
}

package com.auth.server.Repository;

import com.auth.server.Entity.AuthIdentity;
import com.auth.server.Entity.FederatedIdentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FederatedIdentityRepository extends JpaRepository<FederatedIdentity,Long> {
    boolean existsByAuthIdentityAndProvider(AuthIdentity authIdentity, String provider);
    Optional<FederatedIdentity>findByProviderAndProviderId(String provider, String providerId);
    List<FederatedIdentity>findByAuthIdentity(AuthIdentity authIdentity);
    @Query("SELECT f.authIdentity FROM FederatedIdentity f WHERE f.providerId = :providerId")
    Optional<AuthIdentity> findAuthIdentityByProviderId(@Param("providerId") String providerId);

}

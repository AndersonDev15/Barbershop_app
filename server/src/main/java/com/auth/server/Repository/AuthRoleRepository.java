package com.auth.server.Repository;

import com.auth.server.Entity.AuthRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRoleRepository extends JpaRepository<AuthRole,Long> {
    Optional<AuthRole>findByName(String name);
}

package com.auth.server.Repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OAuth2AuthorizationJdbcRepository {
    private final JdbcTemplate jdbcTemplate;

    public void deleteByPrincipalName(String principalName){
        jdbcTemplate.update("DELETE FROM oauth2_authorization WHERE principal_name = ?",principalName);

    }
}

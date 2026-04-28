package com.auth.server.infrastructure.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO que Auth Server envía a Business API para sincronizar usuario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSyncRequest {
    private UUID userUuid;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
}
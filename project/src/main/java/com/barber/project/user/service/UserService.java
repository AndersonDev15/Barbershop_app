package com.barber.project.user.service;

import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.user.entity.User;
import com.barber.project.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getByUuid(UUID userUuid) {
        return userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    public boolean existsByUuid(UUID userUuid) {
        return userRepository.existsByUserUuid(userUuid);
    }
}
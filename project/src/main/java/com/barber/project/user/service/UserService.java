package com.barber.project.user.service;

import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.user.entity.User;
import com.barber.project.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getByUuid(String userUuid) {
        return userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    public boolean existsByUuid(String userUuid) {
        return userRepository.existsByUserUuid(userUuid);
    }
}
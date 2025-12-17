package com.barber.project.Service.Clients;

import com.barber.project.Dto.Request.Client.ClientProfileUpdateRequest;
import com.barber.project.Dto.Response.Auth.ClientProfileResponse;
import com.barber.project.Entity.Client;
import com.barber.project.Entity.User;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.ClientRepository;
import com.barber.project.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientProfileService {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    public ClientProfileService(UserRepository userRepository, PasswordEncoder passwordEncoder, ClientRepository clientRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.clientRepository = clientRepository;
    }

    @Transactional(readOnly = true)
    public ClientProfileResponse getProfile(){
        String email = getAuthenticatedUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));
        Client client = clientRepository.findByUser(user)
                .orElseThrow(()-> new ResourceNotFoundException("Cliente no encontrado"));
        return mapToResponse(user,client);
    }

    @Transactional
    public ClientProfileResponse UpdateProfile(ClientProfileUpdateRequest request){
        String email = getAuthenticatedUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));
        Client client = clientRepository.findByUser(user)
                .orElseThrow(()->new ResourceNotFoundException("Cliente no encontrado"));
        //actualizar campos
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        clientRepository.save(client);
        return mapToResponse(user,client);
    }

    private String getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    private ClientProfileResponse mapToResponse(User user, Client client) {
        return new ClientProfileResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                client.getPreferences(),
                client.getLastVisitDate()
        );
    }
}

package com.barber.project.client.service;

import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.client.dto.response.ClientProfileResponse;
import com.barber.project.client.entity.Client;
import com.barber.project.user.entity.User;
import com.barber.project.client.repository.ClientRepository;
import com.barber.project.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClientProfileService {
    private final UserService userService;
    private final ClientRepository clientRepository;

    @Transactional
    public Client createClient (String userUuid){
        User user = userService.getByUuid(userUuid);

        return clientRepository.findByUser_UserUuid(userUuid)
                .orElseGet(()->{
                    Client newClient = Client.builder()
                            .user(user)
                            .build();
                    return clientRepository.save(newClient);
                });
    }


    @Transactional(readOnly = true)
    public ClientProfileResponse getProfile(String userUuid){
        Client client = clientRepository.findByUser_UserUuid(userUuid)
                .orElseThrow(()-> new ResourceNotFoundException("Cliente no encontrado"));
        return mapToResponse(client);
    }




    private ClientProfileResponse mapToResponse(Client client) {
        User user = client.getUser();
        return new ClientProfileResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone()

        );
    }
}

package com.barber.project.Service.Barber;

import com.barber.project.Dto.Request.Barber.BarberProfileUpdateRequest;
import com.barber.project.Dto.Response.Barber.BarberProfileResponse;
import com.barber.project.Entity.Barber;
import com.barber.project.Entity.User;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberRepository;
import com.barber.project.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BarberProfileService {
    private final UserRepository userRepository;
    private final BarberRepository barberRepository;

    public BarberProfileService(UserRepository userRepository, BarberRepository barberRepository) {
        this.userRepository = userRepository;
        this.barberRepository = barberRepository;
    }

    @Transactional(readOnly = true)
    public BarberProfileResponse getProfile(){
        String email = getAuthenticatedUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));

        Barber barber = barberRepository.findByUser(user)
                .orElseThrow(()->new ResourceNotFoundException("Barbero no encontrado"));
        return mapToResponse(user,barber);
    }

    @Transactional
    public BarberProfileResponse updateProfile(BarberProfileUpdateRequest request){
        String email = getAuthenticatedUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));

        Barber barber = barberRepository.findByUser(user)
                .orElseThrow(()->new ResourceNotFoundException("Barbero no encontrado"));
        //actualizar datos
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        return mapToResponse(user,barber);
    }


    private String getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    private BarberProfileResponse mapToResponse(User user, Barber barber) {
        return new BarberProfileResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                barber.getDocumentNumber(),
                barber.getCommission(),
                barber.getBarberShop().getName()

        );
    }

}

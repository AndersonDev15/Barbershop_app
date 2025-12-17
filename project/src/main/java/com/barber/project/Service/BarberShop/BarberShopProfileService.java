package com.barber.project.Service.BarberShop;

import com.barber.project.Dto.Request.BarberShop.BarberShopProfileUpdateRequest;
import com.barber.project.Dto.Response.BarberShop.BarberShopProfileResponse;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.User;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberShopRepository;
import com.barber.project.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BarberShopProfileService {
    private final UserRepository userRepository;
    private final BarberShopRepository barberShopRepository;

    public BarberShopProfileService(UserRepository userRepository, BarberShopRepository barberShopRepository) {
        this.userRepository = userRepository;
        this.barberShopRepository = barberShopRepository;
    }

    @Transactional(readOnly = true)
    public BarberShopProfileResponse getProfile(){
        String email = getAuthenticatedUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));
        BarberShop barberShop = barberShopRepository.findByUser(user)
                .orElseThrow(()->new ResourceNotFoundException("Barberia no encontrada"));
        return mapToResponse(user,barberShop);
    }

    @Transactional
    public BarberShopProfileResponse updateProfile(BarberShopProfileUpdateRequest request){
        String email = getAuthenticatedUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));
        BarberShop barberShop = barberShopRepository.findByUser(user)
                .orElseThrow(()->new ResourceNotFoundException("Barberia no encontrada"));
        //actualizar datos
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        barberShop.setName(request.getBarberShopName());
        barberShop.setAddress(request.getAddress());
        userRepository.save(user);
        barberShopRepository.save(barberShop);
        return mapToResponse(user,barberShop);

    }

    private String getAuthenticatedUsername(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();

    }

    private BarberShopProfileResponse mapToResponse(User user, BarberShop barberShop){
        return new BarberShopProfileResponse(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                barberShop.getName(),
                barberShop.getAddress(),
                barberShop.getPhone()

        );
    }
}

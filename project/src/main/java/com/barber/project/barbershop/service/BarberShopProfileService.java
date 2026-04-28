package com.barber.project.barbershop.service;


import com.barber.project.barbershop.dto.response.BarberShopExistsResponse;
import com.barber.project.barbershop.dto.request.BarberShopProfileCreateRequest;
import com.barber.project.barbershop.dto.request.BarberShopProfileUpdateRequest;
import com.barber.project.barbershop.dto.response.BarberShopProfileResponse;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.enums.BarberShopStatus;
import com.barber.project.barbershop.repository.BarberShopImageRepository;
import com.barber.project.user.entity.User;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.barbershop.repository.BarberShopRepository;
import com.barber.project.user.service.UserService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Optional;
import java.util.UUID;

import static com.barber.project.Util.StringNormalizer.normalize;

@Service
@RequiredArgsConstructor
public class BarberShopProfileService {
    private final UserService userService;
    private final BarberShopRepository barberShopRepository;
    private final BarberShopImageRepository barberShopImageRepository;


    @Transactional
    public BarberShopProfileResponse createProfile(UUID userUuid, BarberShopProfileCreateRequest request){
        User user = userService.getByUuid(userUuid);


        if(barberShopRepository.existsByUser_UserUuid(userUuid)){
            throw new ValidationException("El usuario ya tiene una barberia registrado");
        }

        BarberShop barberShop = BarberShop.builder()
                .name(request.barberShopName())
                .department(normalize(request.department()))
                .city(normalize(request.city()))
                .address(request.address())
                .phone(request.phone())
                .status(BarberShopStatus.ACTIVO)
                .user(user)
                .build();
        barberShopRepository.save(barberShop);
        return mapToResponse(barberShop);
    }

    @Transactional(readOnly = true)
    public BarberShopProfileResponse getProfile(UUID userUuid){
        return barberShopRepository.findByUser_UserUuid(userUuid)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Barbería no encontrada"));
    }

    @Transactional(readOnly = true)
    public BarberShopExistsResponse getMyBarberShop(UUID userUuid) {
        boolean exists = barberShopRepository.existsByUser_UserUuid(userUuid);
        return new BarberShopExistsResponse(exists);
    }

    @Transactional
    public BarberShopProfileResponse updateProfile(UUID userUuid, BarberShopProfileUpdateRequest request) {
        BarberShop barberShop = barberShopRepository.findByUser_UserUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Barbería no encontrada"));

        barberShop.setName(request.getBarberShopName());
        barberShop.setDepartment(normalize(request.getDepartment()));
        barberShop.setCity(normalize(request.getCity()));
        barberShop.setAddress(request.getAddress());
        barberShop.setPhone(request.getBarberShopPhone());
        barberShopRepository.save(barberShop);
        return mapToResponse(barberShop);
    }


    private BarberShopProfileResponse mapToResponse(BarberShop barberShop){

        String coverImageUrl = Optional.ofNullable(
                barberShopImageRepository.findCoverImageUrl(barberShop.getId())
        ).orElse(null);

        return new BarberShopProfileResponse(
                barberShop.getId(),
                barberShop.getName(),
                barberShop.getDepartment(),
                barberShop.getCity(),
                barberShop.getAddress(),
                barberShop.getPhone(),
                barberShop.getStatus(),
                coverImageUrl
        );
    }



}


package com.barber.project.barber.service;

import com.barber.project.barber.dto.request.BarberRequest;
import com.barber.project.barber.entity.Barber;
import com.barber.project.barber.dto.response.BarberResponse;
import com.barber.project.barbershop.dto.response.UpdateBarberResponse;
import com.barber.project.barbershop.entity.BarberInvitation;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barber.entity.enums.BarberStatus;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.barber.repository.BarberRepository;
import com.barber.project.barbershop.service.BarberShopService;
import com.barber.project.user.entity.User;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;


@Service
@RequiredArgsConstructor
public class BarberService {
    private final BarberRepository barberRepository;
    private final BarberShopService barberShopService;

    @Transactional(readOnly = true)
    public Page<BarberResponse> getBarbersByBarberShopId(Long barbershopId, Pageable pageable) {

        BarberShop barberShop = barberShopService.getBarberShopById(barbershopId);
        barberShopService.ensureActive(barberShop);

        return barberRepository.findByBarberShopId(barbershopId, pageable)
                .map(this::mapToBarberResponse);
    }

    @Transactional(readOnly = true)
    public Barber getBarberById(Long barberId) {
        return barberRepository.findById(barberId)
                .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));
    }

    @Transactional(readOnly = true)
    public Barber getBarberByUserUuid(String userUuid) {
        return barberRepository.findByUser_UserUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));
    }

    @Transactional(readOnly = true)
    public Barber getBarberByIdAndBarberShopId(Long barberId, Long barberShopId) {
        return barberRepository.findByIdAndBarberShop_Id(barberId, barberShopId)
                .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado en tu barbería"));
    }

    @Transactional
    public UpdateBarberResponse updateCommission(Barber barber, BigDecimal newCommission) {
        barber.setCommission(newCommission);
        return UpdateBarberResponse.from(barberRepository.save(barber));
    }



    @Transactional
    public void changeStatus(Barber barber, BarberStatus newStatus) {
        barber.setStatus(newStatus);
        barberRepository.save(barber);
    }

    public void validateBarberIsActive(Barber barber) {
        if (barber.getStatus() != BarberStatus.ACTIVO) {
            throw new ValidationException(
                    "El barbero no está disponible porque está " + barber.getStatus()
            );
        }
    }

    public void validateCommission(BigDecimal commission) {
        if (commission.compareTo(BigDecimal.ZERO) < 0 ||
                commission.compareTo(BigDecimal.ONE) > 0) {
            throw new ValidationException("La comisión debe estar entre 0% y 100%");
        }
    }

    public void validateUserHasNoBarberShop(User user) {
        barberRepository.findByUser(user).ifPresent(barber -> {
            throw new ValidationException("Ya perteneces a una barbería");
        });
    }

    public void createBarber(User user, BarberShop barberShop, BarberInvitation invitation) {
        barberRepository.save(Barber.builder()
                .user(user)
                .barberShop(barberShop)
                .documentNumber(invitation.getDocumentNumber())
                .commission(invitation.getCommission())
                .status(BarberStatus.ACTIVO)
                .build());
    }

    @Transactional(readOnly = true)
    public long countActiveBarbers(Long barberShopId) {
        return barberRepository.countActiveBarbers(barberShopId);
    }





    private BarberResponse mapToBarberResponse(Barber barber) {
        User user = barber.getUser();
        return new BarberResponse(
                barber.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                barber.getDocumentNumber(),
                barber.getCommission(),
                barber.getStatus()
        );
    }


}


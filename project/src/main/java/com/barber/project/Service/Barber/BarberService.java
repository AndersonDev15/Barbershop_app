package com.barber.project.Service.Barber;

import com.barber.project.Dto.Response.Barber.BarberResponseClient;
import com.barber.project.Dto.Response.BarberShop.BarberResponse;
import com.barber.project.Entity.Barber;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Client;
import com.barber.project.Entity.enums.BarberStatus;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberRepository;
import com.barber.project.Repository.BarberShopRepository;
import com.barber.project.Service.BarberShop.BarberShopService;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class BarberService {
    private final BarberRepository barberRepository;
    private final BarberShopRepository barberShopRepository;
    private final BarberShopService barberShopService;

    public List<BarberResponseClient> getBarbersByBarberShopId(Long barbershopId) {
        BarberShop barberShop = barberShopRepository.findById(barbershopId)
                .orElseThrow(()->new ResourceNotFoundException("Barberia no encontrada"));

        barberShopService.ensureActive(barberShop);
        //barberos
        List<Barber> barbers = barberRepository.findByBarberShop(barberShop);
        return barbers.stream()
                .map(this::mapToBarberResponse)
                .toList();

    }

    public Barber getBarberById(Long barberId) {
        return barberRepository.findById(barberId)
                .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));
    }

    public void validateBarberIsActive(Barber barber) {
        if (barber.getStatus() != BarberStatus.ACTIVO) {
            throw new ValidationException(
                    "El barbero no está disponible porque está " + barber.getStatus()
            );
        }
    }

    public Barber getAuthenticatedBarber() {
        String userEmail = getUserEmail();

        Barber barber = barberRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Barbero no encontrado"));

        // validar que el barbero esté activo

        return barber;
    }

    private String getUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    private BarberResponseClient mapToBarberResponse(Barber barber) {
        return BarberResponseClient.builder()
                .barberId(barber.getId())
                .userId(barber.getUser().getId())
                .firstName(barber.getUser().getFirstName())
                .lastName(barber.getUser().getLastName())
                .email(barber.getUser().getEmail())
                .phone(barber.getUser().getPhone())
                .documentNumber(barber.getDocumentNumber())
                .build();
    }


}

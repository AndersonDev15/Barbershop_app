package com.barber.project.client.service;


import com.barber.project.client.entity.Client;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.client.repository.ClientRepository;
import com.barber.project.barbershop.dto.response.BarberShopResponse;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.OpeningHours;
import com.barber.project.barbershop.service.BarberShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final BarberShopService barberShopService;

    @Transactional(readOnly = true)
    public Client getClientByUserUuid(String userUuid) {
        return clientRepository.findByUser_UserUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
    }

    //buscar barberias por nombre
    public BarberShopResponse searchByName(String name){
        BarberShop barberShop = barberShopService.getBarberShopByName(name);

        barberShopService.ensureActive(barberShop);

        DayOfWeek today = LocalDate.now().getDayOfWeek();

        List<OpeningHours> schedules = barberShopService.getOpeningHours(barberShop,today);
        boolean open = isOpen(schedules);
        List<String> schedule = getTodaySchedule(schedules);
        return mapToResponse(barberShop,open,schedule);

    }


    private boolean isOpen(List<OpeningHours> schedules){
        LocalTime now = LocalTime.now();
        return schedules.stream()
                .anyMatch(hours->
                        !now.isBefore(hours.getStartTime()) &&
                                !now.isAfter(hours.getEndTime())
                );



    }
    private List<String> getTodaySchedule(List<OpeningHours> schedules) {

        return schedules.stream()
                .map(hours -> hours.getStartTime() + " - " + hours.getEndTime())
                .toList();

    }



    private BarberShopResponse mapToResponse(BarberShop barberShop, boolean openNow, List<String> todaySchedules) {
        return new BarberShopResponse(
                barberShop.getId(),
                barberShop.getName(),
                barberShop.getAddress(),
                barberShop.getPhone(),
                openNow,
                todaySchedules
        );
    }

}


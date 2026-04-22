package com.barber.project.client.service;


import com.barber.project.barbershop.entity.enums.BarberShopStatus;
import com.barber.project.client.entity.Client;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.client.repository.ClientRepository;
import com.barber.project.barbershop.dto.response.BarberShopResponse;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.OpeningHours;
import com.barber.project.barbershop.service.BarberShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.barber.project.Util.StringNormalizer.normalize;

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
    public List<BarberShopResponse> searchByName(String name) {
        DayOfWeek today = LocalDate.now().getDayOfWeek();

        return barberShopService.searchByNameContaining(name)
                .stream()
                .filter(shop -> shop.getStatus() == BarberShopStatus.ACTIVO)
                .map(shop -> {
                    List<OpeningHours> schedules = barberShopService.getOpeningHours(shop, today);
                    boolean open = isOpen(schedules);
                    List<String> schedule = getTodaySchedule(schedules);
                    return mapToResponse(shop, open, schedule);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<BarberShopResponse> getByCity(String city, Pageable pageable) {

        String normalizedCity = normalize(city);

        Page<BarberShop> page =
                barberShopService.findActiveByCity(normalizedCity, pageable);

        return page.map(barberShop -> {

            DayOfWeek today = LocalDate.now().getDayOfWeek();

            List<OpeningHours> schedules =
                    barberShopService.getOpeningHours(barberShop, today);

            boolean open = isOpen(schedules);
            List<String> schedule = getTodaySchedule(schedules);

            return mapToResponse(barberShop, open, schedule);
        });
    }

    @Transactional(readOnly = true)
    public BarberShopResponse getById(Long id) {

        BarberShop barberShop = barberShopService.getBarberShopById(id);

        barberShopService.ensureActive(barberShop);

        DayOfWeek today = LocalDate.now().getDayOfWeek();

        List<OpeningHours> schedules =
                barberShopService.getOpeningHours(barberShop, today);

        boolean open = isOpen(schedules);
        List<String> schedule = getTodaySchedule(schedules);

        return mapToResponse(barberShop, open, schedule);
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



    private BarberShopResponse mapToResponse(
            BarberShop barberShop,
            boolean openNow,
            List<String> todaySchedules
    ) {

        String coverImageUrl = barberShopService.getCoverImageUrl(barberShop);

        return new BarberShopResponse(
                barberShop.getId(),
                barberShop.getName(),
                barberShop.getDepartment(),
                barberShop.getCity(),
                barberShop.getAddress(),
                barberShop.getPhone(),
                openNow,
                todaySchedules,
                coverImageUrl
        );
    }

}


package com.barber.project.Service.Clients;

import com.barber.project.Dto.Response.BarberShop.BarberShopResponse;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Client;
import com.barber.project.Entity.OpeningHours;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberShopRepository;
import com.barber.project.Repository.ClientRepository;
import com.barber.project.Repository.OpeningHoursRepository;
import com.barber.project.Service.BarberShop.BarberShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final BarberShopRepository barberShopRepository;
    private final OpeningHoursRepository openingHoursRepository;
    private final BarberShopService barberShopService;


    //buscar barberias por nombre
    public BarberShopResponse searchByName(String name){
        BarberShop barberShop = barberShopRepository.findByNameIgnoreCase(name)
                .orElseThrow(()->new ResourceNotFoundException("Barberia no encontrada"));

        barberShopService.ensureActive(barberShop);

        boolean open = isOpen(barberShop);
        List<String> schedule = getTodaySchedule(barberShop);
        return mapToResponse(barberShop,open,schedule);

    }


    private boolean isOpen(BarberShop barberShop){
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        LocalTime now = LocalTime.now();

        List<OpeningHours> schedules = openingHoursRepository.findByBarberShopAndDayOfWeek(barberShop,today);
        if(schedules.isEmpty()){
            return false;
        }
        return schedules.stream()
                .anyMatch(hours->
                        !now.isBefore(hours.getStartTime()) &&
                                !now.isAfter(hours.getEndTime())
                );



    }
    private List<String> getTodaySchedule(BarberShop barberShop){

        DayOfWeek today = LocalDate.now().getDayOfWeek();
        List<OpeningHours> schedules = openingHoursRepository.findByBarberShopAndDayOfWeek(barberShop, today);

        if (schedules.isEmpty()) {
            return List.of();
        }
        return schedules.stream()
                .map(hours -> hours.getStartTime() + " - " + hours.getEndTime())
                .toList();

    }

    private BarberShopResponse mapToResponse( BarberShop barberShop, boolean openNow, List<String> todaySchedules){
        return BarberShopResponse.builder()
                .id(barberShop.getId())
                .name(barberShop.getName())
                .address(barberShop.getName())
                .phone(barberShop.getPhone())
                .openNow(openNow)
                .todaySchedules(todaySchedules)
                .build();
    }

    public Client getAuthenticatedClient() {
        String userEmail = getUserEmail();

        Client client = clientRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        // validar que el cliente esté activo

        return client;
    }

    private String getUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
}

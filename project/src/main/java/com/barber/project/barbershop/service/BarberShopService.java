package com.barber.project.barbershop.service;

import com.barber.project.barbershop.dto.request.OpeningHoursRequest;
import com.barber.project.barbershop.dto.response.OpeningHoursResponse;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.OpeningHours;
import com.barber.project.barbershop.entity.enums.BarberShopStatus;
import com.barber.project.shared.Exception.BadRequestException;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.barbershop.repository.BarberShopRepository;
import com.barber.project.barbershop.repository.OpeningHoursRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberShopService {
    private final BarberShopRepository barberShopRepository;
    private final OpeningHoursRepository openingHoursRepository;


    // crear horarios de atencion
    @Transactional
    public OpeningHoursResponse createOpeningHours(OpeningHoursRequest request, String ownerUuid){

        BarberShop barberShop = getOwnerBarberShop(ownerUuid);
        ensureActive(barberShop);

        LocalTime start = LocalTime.parse(request.startTime());
        LocalTime end = LocalTime.parse(request.endTime());

        validateSchedule(start,end);
        DayOfWeek day = request.dayOfWeek();
        List<OpeningHours> existing = openingHoursRepository.findByBarberShopAndDayOfWeek(barberShop,day);

        //solapamiento
        for(OpeningHours hours: existing){
            boolean overlaps = (start.isBefore(hours.getEndTime()) && end.isAfter(hours.getStartTime()));
            if (overlaps) {
                throw new BadRequestException("El rango se solapa con otro horario existente: " +
                        hours.getStartTime() + " - " + hours.getEndTime());
            }
        }


        //crear el horario
        OpeningHours hours = new OpeningHours();
        hours.setDayOfWeek(day);
        hours.setStartTime(start);
        hours.setEndTime(end);
        hours.setBarberShop(barberShop);


        return mapToResponseHours(openingHoursRepository.save(hours));

    }


    //Listar los horarios
    @Transactional(readOnly = true)
    public List<OpeningHoursResponse> listOpeningHours(String ownerUuid){
        BarberShop barberShop = getOwnerBarberShop(ownerUuid);

        return openingHoursRepository.findByBarberShop(barberShop)
                .stream()
                .map(this::mapToResponseHours)
                .toList();
    }
    //editar horario
    @Transactional
    public OpeningHoursResponse updateOpeningHours(Long id, OpeningHoursRequest request, String ownerUuid){
        BarberShop barberShop = getOwnerBarberShop(ownerUuid);
        ensureActive(barberShop);

        OpeningHours existing = openingHoursRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));
        if(!existing.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException("No tienes permiso para editar este horario");
        }

        LocalTime start = LocalTime.parse(request.startTime());
        LocalTime end = LocalTime.parse(request.endTime());
        validateSchedule(start,end);

        DayOfWeek day = request.dayOfWeek();

        //todos los horarios excepto ela ctual
        List<OpeningHours> others = openingHoursRepository
                .findByBarberShopAndDayOfWeek(barberShop,day)
                .stream()
                .filter(hours -> !hours.getId().equals(id))
                .toList();
        //verificar solapamiento
        for(OpeningHours hours: others){
            boolean overlaps = (start.isBefore(hours.getEndTime()) && end.isAfter(hours.getStartTime()));
            if (overlaps) {
                throw new BadRequestException("El rango se solapa con otro horario existente: " +
                        hours.getStartTime() + " - " + hours.getEndTime());
            }
        }

        //actualizar
        existing.setDayOfWeek(day);
        existing.setStartTime(start);
        existing.setEndTime(end);

        OpeningHours updated = openingHoursRepository.save(existing);
        return mapToResponseHours(updated);
    }
    //eliminar horario
    @Transactional
    public void deleteOpeningHours(Long id, String ownerUuid){
        BarberShop barberShop = getOwnerBarberShop(ownerUuid);
        ensureActive(barberShop);

        OpeningHours hours = openingHoursRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));

        if (!hours.getBarberShop().getId().equals(barberShop.getId())) {
            throw new ValidationException("No tienes permiso para eliminar este horario");
        }

        openingHoursRepository.delete(hours);
    }

    @Transactional
    public void activateBarberShop(String ownerUuid){
        changeBarberShopStatus(ownerUuid, BarberShopStatus.ACTIVO);
    }

    @Transactional
    public void desactivateBarberShop(String ownerUuid){
        changeBarberShopStatus(ownerUuid, BarberShopStatus.INACTIVO);
    }






    // helpers..

    public List<OpeningHours> getOpeningHours(BarberShop barberShop, DayOfWeek day) {
        return openingHoursRepository.findByBarberShopAndDayOfWeek(barberShop, day);
    }

    public BarberShop getBarberShopByName(String name) {
        return barberShopRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new ResourceNotFoundException("Barbería no encontrada"));
    }

    public BarberShop getOwnerBarberShop(String ownerUuid){
        return barberShopRepository.findByUser_UserUuid(ownerUuid)
                .orElseThrow(()->new ResourceNotFoundException("Barbería no encontrada para este usuario"));
    }

    public BarberShop getBarberShopById(Long barbershopId) {
        return barberShopRepository.findById(barbershopId)
                .orElseThrow(() -> new ResourceNotFoundException("Barbería no encontrada"));
    }

    public void ensureActive(BarberShop barberShop) {
        if (barberShop.getStatus() == BarberShopStatus.INACTIVO) {
            throw new BadRequestException("La barbería está inactiva, no puede realizar esta acción.");
        }
    }
    private void validateSchedule(LocalTime start, LocalTime end){
        if (start == null || end == null) {
            throw new BadRequestException("Las horas de inicio y fin son requeridas");
        }

        if (!end.isAfter(start)) {
            throw new BadRequestException("La hora de fin debe ser mayor a la de inicio.");
        }
        if(Duration.between(start,end).toHours()>24){
            throw new BadRequestException("El horario no puede exceder las 24 horas");
        }

    }


    public void changeBarberShopStatus(String ownerUuid, BarberShopStatus newStatus) {
        BarberShop barberShop = getOwnerBarberShop(ownerUuid);

        if (barberShop.getStatus().equals(newStatus)){
            throw new BadRequestException("La barbería ya tiene el estado: " + newStatus);
        }

        barberShop.setStatus(newStatus);
        barberShopRepository.save(barberShop);
    }



    private OpeningHoursResponse mapToResponseHours(OpeningHours hours){
        return new OpeningHoursResponse(
                hours.getId(),
                hours.getDayOfWeek(),
                hours.getStartTime(),
                hours.getEndTime()
        );
    }





}

package com.barber.project.Service.BarberShop;

import com.barber.project.Dto.Request.BarberShop.BarberRequest;
import com.barber.project.Dto.Request.BarberShop.OpeningHoursRequest;
import com.barber.project.Dto.Response.Barber.BarberProfileResponse;
import com.barber.project.Dto.Response.BarberShop.BarberResponse;
import com.barber.project.Dto.Response.BarberShop.OpeningHoursResponse;
import com.barber.project.Dto.Response.BarberShop.BarberShopResponse;
import com.barber.project.Entity.Barber;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.OpeningHours;
import com.barber.project.Entity.User;
import com.barber.project.Entity.enums.BarberShopStatus;
import com.barber.project.Entity.enums.BarberStatus;
import com.barber.project.Entity.enums.UserType;
import com.barber.project.Exception.BadRequestException;
import com.barber.project.Exception.DuplicateResourceException;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberRepository;
import com.barber.project.Repository.BarberShopRepository;
import com.barber.project.Repository.OpeningHoursRepository;
import com.barber.project.Repository.UserRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BarberShopService {
    private final BarberRepository barberRepository;
    private final UserRepository userRepository;
    private final BarberShopRepository barberShopRepository;
    private final OpeningHoursRepository openingHoursRepository;

    //agregar barberos
    @Transactional
    public String addBarber(String BarberEmail, BarberRequest request){
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        ensureActive(barberShop);

        //usuario del nuevo barbero
        User barberUser = userRepository.findByEmail(BarberEmail)
                .orElseThrow(()->new ResourceNotFoundException("Barbero no encontrado"));
        if(!barberUser.getUserType().equals(UserType.BARBERO)){
            throw new ValidationException("El usuario no es un barbero valido");
        }

        //verificar que el barbero no este en otra barberia
        Optional<Barber> existingBarber =  barberRepository.findByUser(barberUser);
        if(existingBarber.isPresent()){
            throw new ValidationException("Este barbero ya pertenece a otra barbería");
        }

        //validar duplicidad
        barberRepository.findByUserAndBarberShop(barberUser,barberShop)
                .ifPresent(barber -> {
                    throw new DuplicateResourceException("El usuario ya está registrado como barbero en esta barbería");
                });
        if(request.getCommission().compareTo(BigDecimal.ZERO)<0 ||
                request.getCommission().compareTo(new BigDecimal("1")) > 0){
            throw new ValidationException("La comisión debe estar entre 0% y 100%");
        }


        Barber barber = new Barber();
        barber.setDocumentNumber(request.getDocumentNumber());
        barber.setCommission(request.getCommission());
        barber.setUser(barberUser);
        barber.setBarberShop(barberShop);
        barberRepository.save(barber);

        return "Barbero {} agregado a barbería {}" + barberUser.getEmail() + barberShop.getName();


    }

    //listar barberos
    @Transactional(readOnly = true)
    public List<BarberResponse> listBarber(){
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        List<Barber> barbers = barberRepository.findByBarberShop(barberShop);
        return barbers.stream()
                .map(this::mapToBarberResponse)
                .toList();
    }

    //actualizar commision
    @Transactional
    public String updateBarberCommission(Long barberId, BigDecimal newCommission){
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(()->new ResourceNotFoundException("Barbero no encontrado"));
        if(!barber.getBarberShop().getId().equals(barberShop.getId())) {
            throw new ValidationException("El barbero no pertenece a esta barbería");
        }
        if(newCommission.compareTo(BigDecimal.ZERO)<0 ||
                newCommission.compareTo(new BigDecimal("1")) > 0){
            throw new ValidationException("La comisión debe estar entre 0% y 100%");
        }

        barber.setCommission(newCommission);
        barberRepository.save(barber);

        return "Comisión actualizada correctamente";
    }

    //desactivar barbero
    @Transactional
    public void desactivateBarber(Long barberId){
        //usuario autenticado
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        Barber barberUser = barberRepository.findById(barberId)
                .orElseThrow(()->new ResourceNotFoundException("Barbero no encontrado"));

        //validar que ese barbero esta en la barberia
        if(!barberUser.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException("No tienes permisos para modificar este barbero");
        }
        barberUser.setStatus(BarberStatus.INACTIVO);
        barberRepository.save(barberUser);

    }
    //activar barbero
    @Transactional
    public void activateBarber(Long barberId){
        //usuario autenticado
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        Barber barberUser = barberRepository.findById(barberId)
                .orElseThrow(()->new ResourceNotFoundException("Barbero no encontrado"));

        //validar que ese barbero esta en la barberia
        if(!barberUser.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException("No tienes permisos para modificar este barbero");
        }
        barberUser.setStatus(BarberStatus.ACTIVO);
        barberRepository.save(barberUser);

    }

    //vacaciones barbero
    @Transactional
    public void summaryBarber(Long barberId){
        //usuario autenticado
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        Barber barberUser = barberRepository.findById(barberId)
                .orElseThrow(()->new ResourceNotFoundException("Barbero no encontrado"));

        //validar que ese barbero esta en la barberia
        if(!barberUser.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException("No tienes permisos para modificar este barbero");
        }
        barberUser.setStatus(BarberStatus.VACACIONES);
        barberRepository.save(barberUser);

    }


    // crear horarios de atencion
    @Transactional
    public OpeningHours createOpeningHours(OpeningHoursRequest request){

        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        ensureActive(barberShop);

        LocalTime start = LocalTime.parse(request.getStartTime());
        LocalTime end = LocalTime.parse(request.getEndTime());

        validateSchedule(start,end);
        DayOfWeek day = request.getDayOfWeek();
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

        return openingHoursRepository.save(hours);

    }


    //Listar los horarios
    @Transactional(readOnly = true)
    public List<OpeningHoursResponse> listOpeningHours(){
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();

        return openingHoursRepository.findByBarberShop(barberShop)
                .stream()
                .map(this::mapToResponseHours)
                .toList();
    }
    //editar horario
    @Transactional
    public OpeningHours updateOpeningHours(Long id, OpeningHoursRequest request){
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        ensureActive(barberShop);

        OpeningHours existing = openingHoursRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));
        if(!existing.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException("No tienes permiso para editar este horario");
        }

        LocalTime start = LocalTime.parse(request.getStartTime());
        LocalTime end = LocalTime.parse(request.getEndTime());
        validateSchedule(start,end);

        DayOfWeek day = request.getDayOfWeek();

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

        return openingHoursRepository.save(existing);
    }
    //eliminar horario
    public void deleteOpeningHours(Long id){
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        ensureActive(barberShop);

        OpeningHours hours = openingHoursRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));

        if (!hours.getBarberShop().getId().equals(barberShop.getId())) {
            throw new ValidationException("No tienes permiso para eliminar este horario");
        }

        openingHoursRepository.delete(hours);
    }

    //desactivar barberia.
    public void desactivateBarberShop(){
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        barberShop.setStatus(BarberShopStatus.INACTIVO);
        barberShopRepository.save(barberShop);
    }

    //activar barberia
    public void activateBarberShop(){
        BarberShop barberShop = getAuthenticatedOwnerBarberShop();
        barberShop.setStatus(BarberShopStatus.ACTIVO);
        barberShopRepository.save(barberShop);
    }





    public void ValidateBarber(Barber barber) {
        if (barber.getStatus() != BarberStatus.ACTIVO) {
            throw new ValidationException(
                    "El barbero no está disponible porque está " + barber.getStatus());
        }
    }
    public BarberShop getBarberShopById(Long id) {
        return barberShopRepository.findById(id)
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
    private String getUserActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
    public BarberShop getAuthenticatedOwnerBarberShop() {
        String emailOwner = getUserActual();
        BarberShop barberShop = barberShopRepository.findByUserEmail(emailOwner)
                .orElseThrow(() -> new ResourceNotFoundException("La barberia no existe"));
        return barberShop;
    }
    private OpeningHoursResponse mapToResponseHours(OpeningHours hours){
        return new OpeningHoursResponse(
                hours.getId(),
                hours.getDayOfWeek(),
                hours.getStartTime(),
                hours.getEndTime()
        );
    }
    private BarberResponse mapToBarberResponse(Barber barber) {
        User user = barber.getUser();

        return BarberResponse.builder()
                .userId(user.getId())
                .barberId(barber.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .documentNumber(barber.getDocumentNumber())
                .commission(barber.getCommission())
                .status(barber.getStatus())
                .build();
    }

}

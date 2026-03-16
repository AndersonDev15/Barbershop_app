package com.barber.project.barbershop.service;

import com.barber.project.barber.service.BarberService;
import com.barber.project.barber.dto.response.BarberResponse;
import com.barber.project.barbershop.dto.response.UpdateBarberResponse;
import com.barber.project.barber.entity.Barber;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barber.entity.enums.BarberStatus;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ManageBarberService {
    private final BarberService barberService;
    private final BarberShopService barberShopService;

    /**
     * Obtener barberos con información completa
     */

    @Transactional(readOnly = true)
    public List<BarberResponse> getBarber(String ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        return barberService.getBarbersByBarberShopId(barberShop.getId());
    }

    //actualizar commision
    @Transactional
    public UpdateBarberResponse updateBarberCommission(Long barberId, BigDecimal newCommission, String ownerUuid){

        validateCommision(newCommission);
        Barber barber = validateBarberOwnership(barberId,ownerUuid);
        return barberService.updateCommission(barber,newCommission);
    }

    /**
     * Cambiar estado de barberos
     */
    @Transactional
    public void deactivateBarber(Long barberId, String ownerUuid) {
        changeBarberStatus(barberId, BarberStatus.INACTIVO, ownerUuid);
    }

    @Transactional
    public void activateBarber(Long barberId, String ownerUuid) {
        changeBarberStatus(barberId, BarberStatus.ACTIVO, ownerUuid);
    }

    @Transactional
    public void setBarberOnVacation(Long barberId, String ownerUuid) {
        changeBarberStatus(barberId, BarberStatus.VACACIONES, ownerUuid);
    }

    //metodos helpers

    //validar barbero
    private Barber validateBarberOwnership(Long barberId, String ownerUuid){

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        Barber barber = barberService.getBarberById(barberId);

        if(!barber.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException( "El barbero no pertenece a tu barbería");
        }
        return barber;
    }

    //caambiar estado del barbero
    private void changeBarberStatus(
            Long barberId,
            BarberStatus newStatus,
            String ownerUuid
    ){
        Barber barber = validateBarberOwnership(barberId,ownerUuid);
        BarberStatus oldStatus = barber.getStatus();
        barberService.changeStatus(barber,newStatus);

    }

    //validar que la commision este en el rango de 0-100%
    private void validateCommision(BigDecimal commission){

        if(commission == null){
            throw new ValidationException("La comision no puede ser nula");
        }

        if(commission.compareTo(BigDecimal.ZERO)<0){
            throw new ValidationException(
                    "La comisión no puede ser negativa."
            );
        }

        if (commission.compareTo(BigDecimal.ONE) > 0) {
            throw new ValidationException("La comisión no puede ser mayor a 100%");
        }

    }

}

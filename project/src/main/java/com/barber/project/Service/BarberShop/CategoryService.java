package com.barber.project.Service.BarberShop;

import com.barber.project.Dto.Request.BarberShop.CategoryRequest;
import com.barber.project.Dto.Response.BarberShop.CategoryResponse;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Category;
import com.barber.project.Entity.enums.CategoryStatus;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberShopRepository;
import com.barber.project.Repository.CategoryRepository;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {
    private final BarberShopService barberShopService;
    private final CategoryRepository categoryRepository;
    private final BarberShopRepository barberShopRepository;

    @Transactional
    public CategoryResponse createService(CategoryRequest request){
        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();
        barberShopService.ensureActive(barberShop);

        if(categoryRepository.existsByBarberShopAndNameIgnoreCase(barberShop,request.getName())){
            throw new ValidationException("Ya existe un servicio con el nombre" + request.getName());
        }

        //guardar
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setBarberShop(barberShop);
        categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse updateService(Long ServiceId, CategoryRequest request){
        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();
        barberShopService.ensureActive(barberShop);
        //obtener el servicio
        Category category = categoryRepository.findByIdAndBarberShop(ServiceId,barberShop)
                .orElseThrow(()->new ResourceNotFoundException("Servicio no encontrado"));

        validateCategoryIsActive(category);
        //validar si ya existe un servicio con el mismo nombre, excluyendo el actual
        if (!category.getName().equalsIgnoreCase(request.getName()) &&
                categoryRepository.existsByBarberShopAndNameIgnoreCase(barberShop, request.getName())) {
            throw new ValidationException("Ya existe una categoría con el nombre " + request.getName());
        }

        //actualizar
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        categoryRepository.save(category);
        return mapToResponse(category);
    }

    //listar los servicios desde la barberia autenticada
    @Transactional(readOnly = true)
    public List<CategoryResponse> listServicesOwner(){
        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();
        return categoryRepository.findByBarberShop(barberShop)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //listar los servicios desde la busqueda del cliente
    @Transactional(readOnly = true)
    public List<CategoryResponse> listServicesByBarberShopId(Long barbershopId){
        BarberShop barberShop = barberShopRepository.findById(barbershopId)
                .orElseThrow(()->new ResourceNotFoundException("Barberia no encontrada"));
        return categoryRepository.findByBarberShop(barberShop)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void activateService(Long serviceId){
        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();
        barberShopService.ensureActive(barberShop);
        Category category = categoryRepository.findById(serviceId)
                .orElseThrow(()->new ResourceNotFoundException("Servicio no encontrado"));
        //validar que el servicio este en la barberia
        if(!category.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException("No tienes permisos para modificar este servicio");
        }
        category.setStatus(CategoryStatus.ACTIVO);
        categoryRepository.save(category);
    }

    @Transactional
    public void desactivateService(Long serviceId){
        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();
        barberShopService.ensureActive(barberShop);
        Category category = categoryRepository.findById(serviceId)
                .orElseThrow(()->new ResourceNotFoundException("Servicio no encontrado"));
        //validar que el servicio este en la barberia
        if(!category.getBarberShop().getId().equals(barberShop.getId())){
            throw new ValidationException("No tienes permisos para modificar este servicio");
        }
        category.setStatus(CategoryStatus.INACTIVO);
        categoryRepository.save(category);
    }

    private CategoryResponse mapToResponse(Category category){
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription()
        );

    }
    public void validateCategoryIsActive(Category category) {
        if (category.getStatus() != CategoryStatus.ACTIVO) {
            throw new ValidationException("La categoría está inactiva, no se pueden realizar esta accion");
        }
    }
    public void validateCategoriesAreActive(List<Long> categoryIds) {
        if (categoryIds.isEmpty()) return;

        // Buscar todas las categorías de una sola vez
        List<Category> categories = categoryRepository.findAllById(categoryIds);

        // Aplicar tu validación normal a cada una
        for (Category category : categories) {
            validateCategoryIsActive(category);
        }
    }



}

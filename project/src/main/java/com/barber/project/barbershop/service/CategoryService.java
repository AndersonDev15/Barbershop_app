package com.barber.project.barbershop.service;

import com.barber.project.barbershop.dto.request.CategoryRequest;
import com.barber.project.barbershop.dto.response.CategoryResponse;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.Category;
import com.barber.project.barbershop.entity.enums.CategoryStatus;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.barbershop.repository.CategoryRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final BarberShopService barberShopService;
    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse createService(CategoryRequest request, String owenerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(owenerUuid);
        barberShopService.ensureActive(barberShop);

        if(categoryRepository.existsByBarberShopAndNameIgnoreCase(barberShop,request.name())){
            throw new ValidationException("Ya existe un servicio con el nombre" + request.name());
        }

        //guardar
        Category category = new Category();
        category.setName(request.name());
        category.setDescription(request.description());
        category.setBarberShop(barberShop);
        categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse updateService(Long ServiceId, CategoryRequest request, String ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        barberShopService.ensureActive(barberShop);
        //obtener el servicio
        Category category = categoryRepository.findByIdAndBarberShop(ServiceId,barberShop)
                .orElseThrow(()->new ResourceNotFoundException("Servicio no encontrado"));

        validateCategoryIsActive(category);
        //validar si ya existe un servicio con el mismo nombre, excluyendo el actual
        if (!category.getName().equalsIgnoreCase(request.name()) &&
                categoryRepository.existsByBarberShopAndNameIgnoreCase(barberShop, request.name())) {
            throw new ValidationException("Ya existe una categoría con el nombre " + request.name());
        }

        //actualizar
        category.setName(request.name());
        category.setDescription(request.description());
        categoryRepository.save(category);
        return mapToResponse(category);
    }

    //listar los servicios desde la barberia autenticada
    @Transactional(readOnly = true)
    public List<CategoryResponse> listServicesOwner(String ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        return categoryRepository.findByBarberShop(barberShop)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

     //.....listar los servicios desde la busqueda del cliente
    @Transactional(readOnly = true)
    public List<CategoryResponse> listServicesByBarberShopId(Long barberShopId) {
        return categoryRepository
                .findByBarberShop_IdAndStatus(barberShopId, CategoryStatus.ACTIVO)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Activar servicio
    @Transactional
    public void activateService(Long serviceId, String ownerUuid) {

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        Category category = getCategoryByIdAndBarberShop(serviceId, barberShop);

        barberShopService.ensureActive(category.getBarberShop());

        category.setStatus(CategoryStatus.ACTIVO);

        categoryRepository.save(category);
    }

    // Desactivar servicio
    @Transactional
    public void desactivateService(Long serviceId, String ownerUuid) {

        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        Category category = getCategoryByIdAndBarberShop(serviceId, barberShop);

        barberShopService.ensureActive(category.getBarberShop());

        category.setStatus(CategoryStatus.INACTIVO);

        categoryRepository.save(category);
    }



    // ------HELPERS ------
    // CategoryService — recibe la categoria y el dueño de esa categoria
    public Category getCategoryByIdAndBarberShop(Long categoryId, BarberShop barberShop) {
        return categoryRepository.findByIdAndBarberShop(categoryId, barberShop)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado"));
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
        List<Category> categories = categoryRepository.findAllById(categoryIds);

        for (Category category : categories) {
            validateCategoryIsActive(category);
        }
    }



}

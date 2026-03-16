package com.barber.project.barbershop.service;

import com.barber.project.barbershop.dto.request.SubCategoryRequest;
import com.barber.project.barbershop.dto.response.SubCategoryResponse;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.Category;
import com.barber.project.barbershop.entity.SubCategory;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.barbershop.repository.SubCategoryRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubCategoryService {
    private final BarberShopService barberShopService;
    private final CategoryService categoryService;
    private final SubCategoryRepository subCategoryRepository;



    @Transactional
    public SubCategoryResponse createSubcategory(Long CategoryId, SubCategoryRequest request,String ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        barberShopService.ensureActive(barberShop);

        Category category = categoryService.getCategoryByIdAndBarberShop(CategoryId,barberShop);
        categoryService.validateCategoryIsActive(category);

        //duplicidad
        if(subCategoryRepository.existsByCategoryAndNameIgnoreCase(category,request.name())){
            throw new ValidationException("Ya existe una subcategoría con este nombre en la categoría");
        }

        //crear la subcategoria
        SubCategory subCategory = new SubCategory();
        subCategory.setName(request.name());
        subCategory.setDescription(request.description());
        subCategory.setDuration(request.duration());
        subCategory.setPrice(request.price());
        subCategory.setCategory(category);
        subCategoryRepository.save(subCategory);
        return mapToResponse(subCategory);
    }

    //listar subcategorias desde la barberia autenticada
    @Transactional(readOnly = true)
    public List<SubCategoryResponse> listSubcategories(Long categoryId, String ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        Category category = categoryService.getCategoryByIdAndBarberShop(categoryId,barberShop);
        return subCategoryRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //listar subctegorias desde el cliente
    @Transactional(readOnly = true)
    public List<SubCategoryResponse> listSubcategoriesByCategoryId(Long categoryId) {
        return subCategoryRepository.findByCategory_Id(categoryId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public SubCategoryResponse updateSubcategory(Long categoryId, Long subCategoryId, SubCategoryRequest request, String ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        barberShopService.ensureActive(barberShop);

        Category category = categoryService.getCategoryByIdAndBarberShop(categoryId,barberShop);
        SubCategory subCategory = getSubCategoryByIdAndCategory(subCategoryId,category);
        categoryService.validateCategoryIsActive(category);

        //validar que no exista una subcategoria con el mismo nombre
        if (!subCategory.getName().equalsIgnoreCase(request.name()) &&
                subCategoryRepository.existsByCategoryAndNameIgnoreCase(category, request.name())) {
            throw new ValidationException("Ya existe una subcategoría con el nombre " + request.name());
        }

        //actualizar
        subCategory.setName(request.name());
        subCategory.setDescription(request.description());
        subCategory.setDuration(request.duration());
        subCategory.setPrice(request.price());
        subCategoryRepository.save(subCategory);
        return mapToResponse(subCategory);

    }

    // helpers...

    public SubCategory getSubCategoryByIdAndCategory(Long subCategoryId, Category category) {
        return subCategoryRepository.findByIdAndCategory(subCategoryId, category)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "La subcategoría no existe o no pertenece a esta categoría"
                ));
    }

    public List<SubCategory> findAllById(List<Long> subcategoryIds) {
        List<SubCategory> services = subCategoryRepository.findAllById(subcategoryIds);
        if (services.isEmpty()) {
            throw new ResourceNotFoundException("Servicios no encontrados");
        }
        return services;
    }

    public List<SubCategory> findByReservationIds(List<Long> reservationIds) {
        return subCategoryRepository.findByReservationIds(reservationIds);
    }

    private SubCategoryResponse mapToResponse(SubCategory subCategory){
        return new SubCategoryResponse(
                subCategory.getId(),
                subCategory.getName(),
                subCategory.getDescription(),
                subCategory.getDuration(),
                subCategory.getPrice()
        );
    }


}

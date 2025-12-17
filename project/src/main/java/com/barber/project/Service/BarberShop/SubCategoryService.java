package com.barber.project.Service.BarberShop;

import com.barber.project.Dto.Request.BarberShop.SubCategoryRequest;
import com.barber.project.Dto.Response.BarberShop.SubCategoryResponse;
import com.barber.project.Entity.BarberShop;
import com.barber.project.Entity.Category;
import com.barber.project.Entity.SubCategory;
import com.barber.project.Exception.ResourceNotFoundException;
import com.barber.project.Repository.BarberShopRepository;
import com.barber.project.Repository.CategoryRepository;
import com.barber.project.Repository.SubCategoryRepository;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class SubCategoryService {
    private final BarberShopService barberShopService;
    private final CategoryService categoryService;
    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final BarberShopRepository barberShopRepository;


    @Transactional
    public SubCategoryResponse createSubcategory(Long CategoryId, SubCategoryRequest request){
        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();
        barberShopService.ensureActive(barberShop);
        Category category = getCategoryByIdAndBarberShop(CategoryId,barberShop);

        categoryService.validateCategoryIsActive(category);

        //duplicidad
        if(subCategoryRepository.existsByCategoryAndNameIgnoreCase(category,request.getName())){
            throw new ValidationException("Ya existe una subcategoría con este nombre en la categoría");
        }

        //crear la subcategoria
        SubCategory subCategory = new SubCategory();
        subCategory.setName(request.getName());
        subCategory.setDescription(request.getDescription());
        subCategory.setDuration(request.getDuration());
        subCategory.setPrice(request.getPrice());
        subCategory.setCategory(category);
        subCategoryRepository.save(subCategory);
        return mapToResponse(subCategory);
    }

    //listar subcategorias desde la barberia autenticada
    @Transactional(readOnly = true)
    public List<SubCategoryResponse> listSubcategories(Long categoryId){
        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();
        barberShopService.ensureActive(barberShop);
        Category category = getCategoryByIdAndBarberShop(categoryId,barberShop);
        categoryService.validateCategoryIsActive(category);

        return subCategoryRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //listar subctegorias desde el cliente
    public List<SubCategoryResponse> listSubcategoryByBarberhopId(Long categoryId, Long barbershopId){
        BarberShop barberShop = barberShopRepository.findById(barbershopId)
                .orElseThrow(()->new ResourceNotFoundException("Barberia no encontrada"));
        Category category = getCategoryByIdAndBarberShop(categoryId,barberShop);
        categoryService.validateCategoryIsActive(category);
        return subCategoryRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public SubCategoryResponse updateSubcategory(Long categoryId, Long subCategoryId, SubCategoryRequest request){
        BarberShop barberShop = barberShopService.getAuthenticatedOwnerBarberShop();
        barberShopService.ensureActive(barberShop);
        Category category = getCategoryByIdAndBarberShop(categoryId,barberShop);
        SubCategory subCategory = getSubCategoryByIdAndCategory(subCategoryId,category);
        categoryService.validateCategoryIsActive(category);

        //validar que no exista una subcategoria con el mismo nombre
        if (!subCategory.getName().equalsIgnoreCase(request.getName()) &&
                subCategoryRepository.existsByCategoryAndNameIgnoreCase(category, request.getName())) {
            throw new ValidationException("Ya existe una subcategoría con el nombre " + request.getName());
        }

        //actualizar
        subCategory.setName(request.getName());
        subCategory.setDescription(request.getDescription());
        subCategory.setDuration(request.getDuration());
        subCategory.setPrice(request.getPrice());
        subCategoryRepository.save(subCategory);
        return mapToResponse(subCategory);

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
    public Category getCategoryByIdAndBarberShop(Long categoryId, BarberShop barberShop) {
        return categoryRepository.findByIdAndBarberShop(categoryId, barberShop)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "La categoría no existe o no pertenece a tu barbería"
                ));
    }
    public SubCategory getSubCategoryByIdAndCategory(Long subCategoryId, Category category) {
        return subCategoryRepository.findByIdAndCategory(subCategoryId, category)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "La subcategoría no existe o no pertenece a esta categoría"
                ));
    }


}

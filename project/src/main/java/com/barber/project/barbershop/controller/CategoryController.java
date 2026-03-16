package com.barber.project.barbershop.controller;

import com.barber.project.barbershop.dto.request.CategoryRequest;
import com.barber.project.barbershop.dto.request.SubCategoryRequest;
import com.barber.project.barbershop.dto.response.CategoryResponse;
import com.barber.project.barbershop.dto.response.SubCategoryResponse;
import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barbershop.service.CategoryService;
import com.barber.project.barbershop.service.SubCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Barbería - Servicios")
@RestController
@RequestMapping("/api/barbershop/services")
@PreAuthorize("hasRole('BARBERIA')")
@AllArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;

    //crear categorias
    // Crear categoría
    @Operation(
            summary = "Crear servicio (categoría)",
            description = "Registra un nuevo servicio que ofrece la barbería."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Servicio creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    })
    @PostMapping
    public ResponseEntity<CategoryResponse> createService(
            @Valid @RequestBody CategoryRequest request,
            @AuthenticationPrincipal CurrentUser currentUser){
        CategoryResponse response = categoryService.createService(request,currentUser.userUuid());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Actualizar categoria
    @Operation(
            summary = "Actualizar servicio",
            description = "Modifica los datos de una categoría existente."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Servicio actualizado"),
            @ApiResponse(responseCode = "404", description = "Servicio no encontrado", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateService(
            @PathVariable Long id, @RequestBody CategoryRequest request,
            @AuthenticationPrincipal CurrentUser currentUser){
        CategoryResponse response = categoryService.updateService(id,request, currentUser.userUuid());
        return ResponseEntity.ok(response);
    }

    // Listar categorías
    @Operation(
            summary = "Listar servicios",
            description = "Devuelve la lista de servicios creados en la barbería."
    )
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> listCategory(@AuthenticationPrincipal CurrentUser currentUser){
        List<CategoryResponse> response = categoryService.listServicesOwner(currentUser.userUuid());
        return ResponseEntity.ok(response);
    }

    // desactivar
    @Operation(summary = "Desactivar servicio")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Servicio desactivado correctamente"),
            @ApiResponse(responseCode = "404", description = "Servicio no encontrado", content = @Content)
    })
    @PatchMapping("/{serviceId}/desactivate")
    public ResponseEntity<Void>desactivateBarber(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long serviceId){
        categoryService.desactivateService(serviceId, currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }
    // activar
    @Operation(summary = "Activar servicio")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Servicio activado correctamente"),
            @ApiResponse(responseCode = "404", description = "Servicio no encontrado", content = @Content)
    })
    @PatchMapping("/{serviceId}/activate")
    public ResponseEntity<Void>activateBarber(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long serviceId){
        categoryService.activateService(serviceId, currentUser.userUuid());
        return ResponseEntity.noContent().build();
    }

    //----------------- subcategorias -----------------
    // Crear subcategoría
    @Operation(
            summary = "Crear subcategoría",
            description = "Agrega una nueva subcategoría asociada a una categoría existente."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subcategoría creada correctamente"),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada", content = @Content)
    })
    @PostMapping("/{categoryId}/subcategory")
    public ResponseEntity<SubCategoryResponse> createSubCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody SubCategoryRequest request,
            @AuthenticationPrincipal CurrentUser currentUser){
        SubCategoryResponse response =  subCategoryService.createSubcategory(categoryId,request, currentUser.userUuid());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Actualizar subcategoría
    @Operation(
            summary = "Actualizar subcategoría",
            description = "Modifica los datos de una subcategoría existente."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subcategoría actualizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Subcategoría no encontrada", content = @Content)
    })

    @PutMapping("/{categoryId}/subcategory/{subcategoryId}")
    public ResponseEntity<SubCategoryResponse> updatedSubCategory(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long categoryId,
            @PathVariable Long subcategoryId,
            @RequestBody SubCategoryRequest request
    ){
        SubCategoryResponse response = subCategoryService.updateSubcategory(categoryId,subcategoryId,request, currentUser.userUuid());
        return ResponseEntity.ok(response);
    }


    //Listar subcategorias
    @Operation(
            summary = "Listar subcategorías",
            description = "Devuelve todas las subcategorías relacionadas con una categoría."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente"),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada", content = @Content)
    })
    @GetMapping("/{categoryId}/subcategory")
    public ResponseEntity<List<SubCategoryResponse>> listSubCategory(
            @PathVariable Long categoryId,
            @AuthenticationPrincipal CurrentUser currentUser){
        List<SubCategoryResponse> responses = subCategoryService.listSubcategories(categoryId, currentUser.userUuid());
        return ResponseEntity.ok(responses);
    }



}

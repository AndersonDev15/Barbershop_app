package com.barber.project.Controller.BarberShop;

import com.barber.project.Dto.Request.BarberShop.CategoryRequest;
import com.barber.project.Dto.Request.BarberShop.SubCategoryRequest;
import com.barber.project.Dto.Response.BarberShop.CategoryResponse;
import com.barber.project.Dto.Response.BarberShop.SubCategoryResponse;
import com.barber.project.Service.BarberShop.CategoryService;
import com.barber.project.Service.BarberShop.SubCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Barbería - Servicios")
@RestController
@RequestMapping("/api/barbershop/category")
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
    public ResponseEntity<CategoryResponse> createService(@Valid @RequestBody CategoryRequest request){
        CategoryResponse response = categoryService.createService(request);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<CategoryResponse> updateService(@PathVariable Long id, @RequestBody CategoryRequest request){
        CategoryResponse response = categoryService.updateService(id,request);
        return ResponseEntity.ok(response);
    }

    // Listar categorías
    @Operation(
            summary = "Listar servicios",
            description = "Devuelve la lista de servicios creados en la barbería."
    )
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> listCategory(){
        List<CategoryResponse> response = categoryService.listServicesOwner();
        return ResponseEntity.ok(response);
    }

    // desactivar
    @Operation(summary = "Desactivar servicio")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Servicio desactivado correctamente"),
            @ApiResponse(responseCode = "404", description = "Servicio no encontrado", content = @Content)
    })
    @PutMapping("/{serviceId}/status/desactivate")
    public ResponseEntity<?>desactivateBarber(@PathVariable Long serviceId){
        categoryService.desactivateService(serviceId);
        return ResponseEntity.ok("Servicio desactivado correctamente");
    }
    // activar
    @Operation(summary = "Activar servicio")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Servicio activado correctamente"),
            @ApiResponse(responseCode = "404", description = "Servicio no encontrado", content = @Content)
    })
    @PutMapping("/{serviceId}/status/activate")
    public ResponseEntity<?>activateBarber(@PathVariable Long serviceId){
        categoryService.activateService(serviceId);
        return ResponseEntity.ok("Servicio activado correctamente");
    }

    // subcategorias
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
    public ResponseEntity<SubCategoryResponse> createSubCategory(@PathVariable Long categoryId, @Valid @RequestBody SubCategoryRequest request){
        SubCategoryResponse response =  subCategoryService.createSubcategory(categoryId,request);
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
    public ResponseEntity<List<SubCategoryResponse>> listSubCategory(@PathVariable Long categoryId){
        List<SubCategoryResponse> responses = subCategoryService.listSubcategories(categoryId);
        return ResponseEntity.ok(responses);
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
            @PathVariable Long categoryId,
            @PathVariable Long subcategoryId,
            @RequestBody SubCategoryRequest request
    ){
        SubCategoryResponse response = subCategoryService.updateSubcategory(categoryId,subcategoryId,request);
        return ResponseEntity.ok(response);
    }



}

package com.barber.project.client.controller;


import com.barber.project.barber.dto.response.BarberResponseClient;
import com.barber.project.barber.dto.response.BarberResponse;
import com.barber.project.barbershop.dto.response.BarberShopResponse;
import com.barber.project.barbershop.dto.response.CategoryResponse;
import com.barber.project.barbershop.dto.response.SubCategoryResponse;
import com.barber.project.barber.service.BarberService;
import com.barber.project.barbershop.service.BarberShopService;
import com.barber.project.barbershop.service.CategoryService;
import com.barber.project.barbershop.service.SubCategoryService;
import com.barber.project.client.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/barbershops")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CLIENTE')")
@Tag(name="Cliente - Búsqueda")
public class SerchBarberShopController {
    private final ClientService clientService;
    private final BarberService barberService;
    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;

    @Operation(
            summary = "Buscar barbería por nombre",
            description = "Permite a un cliente buscar una barbería específica utilizando parte o la totalidad de su nombre."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Barbería encontrada con éxito."

            ),
            @ApiResponse(responseCode = "404", description = "No se encontró ninguna barbería con ese nombre.")
    })
    @GetMapping("/search")
    public ResponseEntity<BarberShopResponse> searchBarberShop(@RequestParam String name){
        BarberShopResponse barberShop = clientService.searchByName(name);
        return ResponseEntity.ok(barberShop);
    }

    @Operation(
            summary = "Obtener barberos de una barbería",
            description = "Devuelve una lista de todos los barberos que trabajan en la barbería especificada por su ID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de barberos obtenida con éxito."
            ),
            @ApiResponse(responseCode = "404", description = "ID de barbería no encontrado."),
            @ApiResponse(responseCode = "400", description = "ID de barbería inválido.")
    })
    @GetMapping("/{barbershopId}/barbers")
    public ResponseEntity<List<BarberResponse>>getBarbersByShop(@PathVariable Long barbershopId){
        List<BarberResponse> barbers = barberService.getBarbersByBarberShopId(barbershopId);
        return ResponseEntity.ok(barbers);
    }

    //servicios.
    @Operation(
            summary = "Listar servicios de una barberia",
            description = "Devuelve la lista de servicios que ofrece la barberia."
    )
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping("/{barbershopId}/services")
    public ResponseEntity<List<CategoryResponse>> listCategory(@PathVariable Long barbershopId){
        List<CategoryResponse> response = categoryService.listServicesByBarberShopId(barbershopId);
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
    @GetMapping("/{barbershopId}/services/{categoryId}/subcategories")
    public ResponseEntity<List<SubCategoryResponse>> listSubCategory(
            @PathVariable Long barbershopId,
            @PathVariable Long categoryId){
        List<SubCategoryResponse> responses = subCategoryService.listSubcategoriesByCategoryId(categoryId);
        return ResponseEntity.ok(responses);
    }
}


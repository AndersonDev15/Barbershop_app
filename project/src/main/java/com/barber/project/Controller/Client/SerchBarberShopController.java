package com.barber.project.Controller.Client;

import com.barber.project.Dto.Response.Barber.BarberResponseClient;
import com.barber.project.Dto.Response.BarberShop.BarberResponse;
import com.barber.project.Dto.Response.BarberShop.BarberShopResponse;
import com.barber.project.Dto.Response.BarberShop.CategoryResponse;
import com.barber.project.Dto.Response.BarberShop.SubCategoryResponse;
import com.barber.project.Service.Barber.BarberService;
import com.barber.project.Service.BarberShop.BarberShopService;
import com.barber.project.Service.BarberShop.CategoryService;
import com.barber.project.Service.BarberShop.SubCategoryService;
import com.barber.project.Service.Clients.ClientService;
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
    public ResponseEntity<BarberShopResponse> SearchBarber(@RequestParam String name){
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
    public ResponseEntity<List<BarberResponseClient>>getBarbersByShop(@PathVariable Long barbershopId){
        List<BarberResponseClient> barbers = barberService.getBarbersByBarberShopId(barbershopId);
        return ResponseEntity.ok(barbers);
    }

    //servicios.
    @Operation(
            summary = "Listar servicios",
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
    @GetMapping("/{barbershopId}/{categoryId}/subcategory")
    public ResponseEntity<List<SubCategoryResponse>> listSubCategory(@PathVariable Long categoryId, @PathVariable Long barbershopId){
        List<SubCategoryResponse> responses = subCategoryService.listSubcategoryByBarberhopId(categoryId,barbershopId);
        return ResponseEntity.ok(responses);
    }
}

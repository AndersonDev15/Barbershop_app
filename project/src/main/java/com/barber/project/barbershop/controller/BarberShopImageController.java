
package com.barber.project.barbershop.controller;

import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barbershop.service.BarberShopImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Tag(name = "Barbería - Gestión de Imágenes")
@RestController
@RequestMapping("/api/barbershop/images")
@PreAuthorize("hasRole('BARBERIA')")
@AllArgsConstructor
public class BarberShopImageController {
    private final BarberShopImageService barberShopImageService;

   //subir imagen
    @Operation(
            summary = "Subir imagen",
            description = "Permite subir una imagen para la barbería. Máximo 5 imágenes por barbería. "
                    + "Valida tamaño y tipo de archivo."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Imagen subida correctamente"),
            @ApiResponse(responseCode = "400", description = "Archivo inválido o se excedió el límite", content = @Content)
    })

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @AuthenticationPrincipal CurrentUser currentUser,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(barberShopImageService.uploadImage(currentUser.userUuid(), file));
    }

    //listar imagenes
    @Operation(
            summary = "Listar imágenes",
            description = "Devuelve todas las imágenes pertenecientes a la barbería del usuario autenticado."
    )
    @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente")
    @GetMapping
    public ResponseEntity<?> list(
            @AuthenticationPrincipal CurrentUser currentUser
    ) {
        return ResponseEntity.ok(barberShopImageService.listMyImages(currentUser.userUuid()));
    }

    //eliminar una imagen
    @Operation(
            summary = "Eliminar imagen",
            description = "Elimina una imagen perteneciente a la barbería del usuario autenticado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Imagen eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Imagen no encontrada", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal CurrentUser currentUser) {
        barberShopImageService.deleteImage(id, currentUser.userUuid());
        return ResponseEntity.ok(Map.of("message", "Imagen eliminada"));
    }

    //imagen de portada
    @Operation(
            summary = "Establecer imagen de portada",
            description = "Marca una imagen existente como portada de la barbería."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Portada actualizada"),
            @ApiResponse(responseCode = "404", description = "Imagen no encontrada", content = @Content)
    })
    @PostMapping("/{id}/cover")
    public ResponseEntity<?> setCover(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long id) {
        barberShopImageService.setCoverImage(id, currentUser.userUuid());
        return ResponseEntity.ok(Map.of("message", "Portada actualizada"));
    }

}



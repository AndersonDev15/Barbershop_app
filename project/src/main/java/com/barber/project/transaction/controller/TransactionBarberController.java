package com.barber.project.transaction.controller;


import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.transaction.dto.response.TransactionResponse;
import com.barber.project.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barber/transactions")
@PreAuthorize("hasRole('BARBERO')")
@RequiredArgsConstructor
@Tag(name = "Barbero - Transacciones")
public class TransactionBarberController {

    private final TransactionService transactionService;

    @Operation(summary = "Completar una transacción", description = "El barbero confirma la recepción del pago.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transacción completada exitosamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "401", description = "No autorizado."),
            @ApiResponse(responseCode = "404", description = "Transacción no encontrada.")
    })
    @PatchMapping("/{id}/complete")
    public ResponseEntity<TransactionResponse> completeTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal CurrentUser currentUser) {

        return ResponseEntity.ok(
                transactionService.completeTransaction(id, currentUser.userUuid())
        );
    }

    @Operation(summary = "Transacciones de hoy", description = "Lista las transacciones del día actual.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @GetMapping("/today")
    public ResponseEntity<List<TransactionResponse>> getTodayTransactions(
            @AuthenticationPrincipal CurrentUser currentUser) {

        return ResponseEntity.ok(
                transactionService.listTodayTransactions(currentUser.userUuid())
        );
    }
}
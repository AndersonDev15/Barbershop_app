package com.barber.project.transaction.controller;


import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.transaction.dto.request.TransactionRequest;
import com.barber.project.transaction.dto.response.TransactionResponse;
import com.barber.project.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/client/transactions")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
@Tag(name = "Cliente - Transacciones")
public class TransactionClientController {
    private final TransactionService transactionService;

    @Operation(summary = "Crear una transacción", description = "El cliente inicia el pago de una reserva completada.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Transacción creada correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.createTransaction(request, currentUser.userUuid()));
    }
}


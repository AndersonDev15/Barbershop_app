package com.barber.project.Controller.Client;

import com.barber.project.Dto.Request.Transaction.TransactionRequest;
import com.barber.project.Dto.Response.Transaction.TransactionResponse;
import com.barber.project.Service.Transaction.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/client/transaction")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
@Tag(name = "Cliente - Transacciones")

public class TransactionClientController {

    private final TransactionService transactionService;

    @Operation(
            summary = "Crear una transacción",
            description = "El cliente inicia una transacción para una reserva."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transacción creada correctamente."),
            @ApiResponse(responseCode = "400", description = "Datos inválidos."),
            @ApiResponse(responseCode = "401", description = "No autorizado.")
    })
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request
    ) {
        return ResponseEntity.ok(
                transactionService.createTransaction(request)
        );
    }
}

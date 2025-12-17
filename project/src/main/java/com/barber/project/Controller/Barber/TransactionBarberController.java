package com.barber.project.Controller.Barber;

import com.barber.project.Dto.Response.Transaction.TransactionResponse;
import com.barber.project.Service.Transaction.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barber/transaction")
@PreAuthorize("hasRole('BARBERO')")
@RequiredArgsConstructor
@Tag(name = "Barbero - Transacciones")
public class TransactionBarberController {

    private final TransactionService transactionService;

    @Operation(
            summary = "Completar una transacción",
            description = """
                    El barbero confirma la prestación del servicio y completa la transacción.
                    - Se envia una notificacion a cliente, barbero y barberia para confirmar una transaccion.
                    """

    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transacción completada exitosamente."),
            @ApiResponse(responseCode = "401", description = "No autorizado."),
            @ApiResponse(responseCode = "403", description = "Acción no permitida."),
            @ApiResponse(responseCode = "404", description = "Transacción no encontrada.")
    })
    @PutMapping("/{id}/complete")
    public ResponseEntity<TransactionResponse> completeTransaction(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                transactionService.completeTransaction(id)
        );
    }

    //obtener las transacciones.
    @Operation(
            summary = "Obtener las transacciones del dia pendientes por confirmar",
            description = """
                    El barbero lista las transacciones pendientes por hacer confirmacion de pago.
                    """

    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transacciónes cargadas correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado."),
            @ApiResponse(responseCode = "403", description = "Acción no permitida."),
            @ApiResponse(responseCode = "404", description = "Transacción no encontrada.")
    })
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTodayTransactions(){
        List<TransactionResponse> responses = transactionService.listTodayTransactions();
        return ResponseEntity.ok(responses);
    }
}

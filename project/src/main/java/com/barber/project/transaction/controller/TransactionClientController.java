package com.barber.project.transaction.controller;


import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.transaction.dto.request.PaymentRequest;
import com.barber.project.transaction.dto.response.TransactionResponse;
import com.barber.project.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/reservations")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
@Tag(name = "Cliente - Pagos")
public class TransactionClientController {

    private final TransactionService transactionService;

    @PostMapping("/{reservationId}/pay")
    public ResponseEntity<TransactionResponse> payReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody PaymentRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.payReservation(reservationId, request, currentUser.userUuid()));
    }


}
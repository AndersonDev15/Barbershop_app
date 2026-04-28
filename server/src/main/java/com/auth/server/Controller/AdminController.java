package com.auth.server.Controller;

import com.auth.server.Service.UserReconciliationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller para tareas de pruebas
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserReconciliationService reconciliationService;

    /**
     * Ejecutar reconciliación manualmente (para testing)
     * POST /admin/reconcile-users
     */
    @PostMapping("/reconcile-users")
    public ResponseEntity<String> reconcileUsers() {

        log.info("Reconciliación manual solicitada");

        reconciliationService.reconcileUsersManually();

        return ResponseEntity.ok("Reconciliación completada. Ver logs para detalles.");
    }
}

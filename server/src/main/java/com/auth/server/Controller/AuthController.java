package com.auth.server.Controller;

import com.auth.server.Dto.Request.RegisterRequest;
import com.auth.server.Service.AuthUserService;
import com.auth.server.Service.LogoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthUserService authUserService;
    private final LogoutService logoutService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        authUserService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        authUserService.verifyEmail(token);
        return ResponseEntity.ok("Correo verificado correctamente. Ya puedes iniciar sesión.");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal Jwt jwt) {
        logoutService.logout(jwt.getTokenValue());
        return ResponseEntity.noContent().build();
    }
}

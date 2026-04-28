package com.auth.server.Controller;

import com.auth.server.Config.jwt.CurrentUser;
import com.auth.server.Dto.Request.ChangePasswordRequest;
import com.auth.server.Dto.Request.ForgotPasswordRequest;
import com.auth.server.Dto.Request.ResetPasswordRequest;
import com.auth.server.Dto.Request.VerifyOtpRequest;
import com.auth.server.Service.PasswordManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {
    private final PasswordManagementService passwordManagementService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        passwordManagementService.forgotPassword(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Void> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {
        passwordManagementService.verifyOtp(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        passwordManagementService.resetPassword(request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal CurrentUser currentUser) {
        passwordManagementService.changePassword(currentUser.userUuid(), request);
        return ResponseEntity.noContent().build();
    }
}
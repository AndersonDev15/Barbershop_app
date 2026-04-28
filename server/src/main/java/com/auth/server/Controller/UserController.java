package com.auth.server.Controller;


import com.auth.server.Config.jwt.CurrentUser;
import com.auth.server.Dto.Request.UpdateUserRequest;
import com.auth.server.Dto.Response.UserResponse;
import com.auth.server.Service.AuthUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final AuthUserService authUserService;

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(
                authUserService.updateProfile(currentUser.userUuid(), request)
        );
    }
}
package com.production.control.auth.controller;

import com.production.control.auth.dto.LoginRequest;
import com.production.control.auth.dto.LoginResponse;
import com.production.control.auth.dto.RegisterRequest;
import com.production.control.auth.dto.UserResponse;
import com.production.control.auth.security.JwtTokenProvider;
import com.production.control.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthService authService, JwtTokenProvider tokenProvider) {
        this.authService = authService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        UserResponse user = authService.authenticate(request.getUsername(), request.getPassword());
        
        String accessToken = tokenProvider.generateToken(user.getUsername(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());
        
        authService.saveRefreshToken(user.getId(), refreshToken);
        
        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(user);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (!tokenProvider.isTokenExpired(refreshToken)) {
            String username = tokenProvider.getUsernameFromToken(refreshToken);
            String role = tokenProvider.getRoleFromToken(refreshToken);
            
            String newAccessToken = tokenProvider.generateToken(username, role);
            
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid or expired refresh token"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        authService.revokeRefreshToken(refreshToken);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}

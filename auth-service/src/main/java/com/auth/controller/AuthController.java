package com.auth.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.auth.dto.AuthResponse;
import com.auth.dto.LoginRequest;
import com.auth.dto.LoginResponse;
import com.auth.dto.RegisterRequest;
import com.auth.dto.ResetPasswordDTO;
import com.auth.dto.UserResponse;

import com.auth.entity.AuthUser;
import com.auth.service.AuthService;
@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService service;

	public AuthController(AuthService service) {
	    this.service = service;
	}
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

        AuthUser saved = service.register(request);

        
        UserResponse responseUser = new UserResponse(
            saved.getId(),
            saved.getEmail()
        );

        return ResponseEntity.ok(
            new AuthResponse("User registered successfully", responseUser)
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        String token = service.login(request.getEmail(), request.getPassword());

        LoginResponse loginResponse = new LoginResponse(
        	    request.getEmail(),   
        	    token
        	);

        	return new AuthResponse(
        	    "Login successful",
        	    loginResponse
        	);
    }
    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(
            @RequestBody ResetPasswordDTO dto) {

        service.updatePassword(dto);

        return ResponseEntity.ok("Password updated");
    }
}
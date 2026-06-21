package com.auth.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.auth.dto.AuthResponse;
import com.auth.dto.LoginRequest;
import com.auth.dto.RegisterRequest;
import com.auth.dto.ResetPasswordDTO;
import com.auth.entity.AuthUser;
import com.auth.service.AuthService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService service;

    @InjectMocks
    private AuthController controller;

    private AuthUser user;

    @BeforeEach
    void setup() {

        user = new AuthUser();
        user.setId(1L);
        user.setEmail("test@gmail.com");
        user.setRole("USER");
    }

    @SuppressWarnings("deprecation")
	@Test
    void testRegisterEndpoint() {

        RegisterRequest request = new RegisterRequest();

        when(service.register(any()))
                .thenReturn(user);

        ResponseEntity<AuthResponse> response =
                controller.register(request);

        assertEquals(200, response.getStatusCodeValue());

        assertNotNull(response.getBody());
    }

    @Test
    void testLoginEndpoint() {

        LoginRequest request = new LoginRequest();
        request.setEmail("test@gmail.com");
        request.setPassword("123");

        when(service.login(anyString(), anyString()))
                .thenReturn("token");

        AuthResponse response = controller.login(request);

        assertNotNull(response);
    }

    @SuppressWarnings("deprecation")
	@Test
    void testUpdatePasswordEndpoint() {

        ResetPasswordDTO dto = new ResetPasswordDTO();

        when(service.updatePassword(any()))
                .thenReturn("Password updated");

        ResponseEntity<String> response =
                controller.updatePassword(dto);

        assertEquals(200, response.getStatusCodeValue());

        assertEquals("Password updated", response.getBody());
    }
    @SuppressWarnings("deprecation")
	@Test
    void testRegisterResponseCoverage() {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail("test@gmail.com");

        when(service.register(any()))
                .thenReturn(user);

        ResponseEntity<AuthResponse> response =
                controller.register(request);

        assertNotNull(response.getBody());

        assertEquals(200,
                response.getStatusCodeValue());
    }
    @Test
    void testLoginResponseCoverage() {

        LoginRequest request =
                new LoginRequest();

        request.setEmail("test@gmail.com");
        request.setPassword("123");

        when(service.login(anyString(), anyString()))
                .thenReturn("jwt-token");

        AuthResponse response =
                controller.login(request);

        assertNotNull(response.getData());

        assertEquals("Login successful",
                response.getMessage());
    }
    @Test
    void testUpdatePasswordResponseCoverage() {

        ResetPasswordDTO dto =
                new ResetPasswordDTO();

        when(service.updatePassword(any()))
                .thenReturn("Password updated");

        ResponseEntity<String> response =
                controller.updatePassword(dto);

        assertEquals("Password updated",
                response.getBody());
    }
    @SuppressWarnings("deprecation")
	@Test
    void testRegisterAdminResponse() {

        RegisterRequest request = new RegisterRequest();

        request.setName("Admin");
        request.setEmail("admin@gmail.com");
        request.setPassword("123");
        request.setRole("ADMIN");

        user.setRole("ADMIN");

        when(service.register(any()))
                .thenReturn(user);

        ResponseEntity<AuthResponse> response =
                controller.register(request);

        assertEquals(200,
                response.getStatusCodeValue());

        assertNotNull(response.getBody());

        assertEquals("User registered successfully",
                response.getBody().getMessage());
    }
    @Test
    void testLoginTokenResponse() {

        LoginRequest request = new LoginRequest();

        request.setEmail("abc@gmail.com");
        request.setPassword("123");

        when(service.login(anyString(), anyString()))
                .thenReturn("jwt-token");

        AuthResponse response =
                controller.login(request);

        assertEquals("Login successful",
                response.getMessage());

        assertNotNull(response.getData());
    }
    @Test
    void testUpdatePasswordResponseBody() {

        ResetPasswordDTO dto =
                new ResetPasswordDTO();

        dto.setEmail("test@gmail.com");

        when(service.updatePassword(any()))
                .thenReturn("Password updated");

        ResponseEntity<String> response =
                controller.updatePassword(dto);

        assertEquals("Password updated",
                response.getBody());
    }
    @Test
    void testLoginResponseData() {

        LoginRequest request =
                new LoginRequest();

        request.setEmail("abc@gmail.com");
        request.setPassword("123");

        when(service.login(anyString(), anyString()))
                .thenReturn("token123");

        AuthResponse response =
                controller.login(request);

        assertNotNull(response.getData());

        assertEquals("Login successful",
                response.getMessage());
    }
    @Test
    void testUpdatePasswordBodyCheck() {

        ResetPasswordDTO dto =
                new ResetPasswordDTO();

        when(service.updatePassword(any()))
                .thenReturn("Password updated");

        ResponseEntity<String> response =
                controller.updatePassword(dto);

        assertNotNull(response);

        assertEquals("Password updated",
                response.getBody());
    }
    @Test
    void testAuthResponseObject() {

        AuthResponse response =
                new AuthResponse("success", "data");

        assertEquals("success",
                response.getMessage());

        assertEquals("data",
                response.getData());
    }
}
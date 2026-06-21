package com.user.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.user.client.AuthClient;
import com.user.client.NotificationClient;
import com.user.dto.OtpRequestDTO;
import com.user.dto.OtpVerifyDTO;
import com.user.dto.RegisterVerifyDTO;
import com.user.dto.ResetPasswordDTO;
import com.user.dto.UserDTO;
import com.user.entity.User;
import com.user.service.UserService;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService service;

    @Mock
    private NotificationClient notificationClient;

    @Mock
    private AuthClient authClient;

    @InjectMocks
    private UserController controller;

    private User user;
    private UserDTO dto;

    @BeforeEach
    void setup() {

        user = new User();
        user.setId(1L);
        user.setName("Kavana");
        user.setEmail("abc@gmail.com");

        dto = new UserDTO();
        dto.setName("Kavana");
        dto.setEmail("abc@gmail.com");
        dto.setPassword("123");
        dto.setRole("USER");
    }

    @Test
    void testCreateUser() {

        when(service.createUser(any(UserDTO.class)))
                .thenReturn(user);

        User result = controller.create(dto);

        assertNotNull(result);
    }

    @Test
    void testGetAllUsers() {

        when(service.getAllUsers())
                .thenReturn(Arrays.asList(user));

        List<User> result = controller.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void testGetById() {

        when(service.getUserById(anyLong()))
                .thenReturn(user);

        User result = controller.getById(1L);

        assertEquals("Kavana", result.getName());
    }

    @Test
    void testGetByEmail() {

        when(service.getUserByEmail(anyString()))
                .thenReturn(user);

        User result =
                controller.getByEmail("abc@gmail.com");

        assertEquals("abc@gmail.com",
                result.getEmail());
    }

    @Test
    void testDeleteUser() {

        when(service.deleteUser(anyLong()))
                .thenReturn("User Deleted Successfully");

        String result = controller.delete(1L);

        assertEquals("User Deleted Successfully",
                result);
    }

    @Test
    void testSendOtp() {

        OtpRequestDTO rqDto =
                new OtpRequestDTO();

        rqDto.setEmail("abc@gmail.com");

        when(service.generateOtp(anyString()))
                .thenReturn("123456");

        String result = controller.sendOtp(rqDto);

        assertEquals("OTP sent successfully", result);
    }

    @Test
    void testVerifyAndRegister() {

        RegisterVerifyDTO rvDto =
                new RegisterVerifyDTO();

        rvDto.setName("Kavana");
        rvDto.setEmail("abc@gmail.com");
        rvDto.setPassword("123");
        rvDto.setRole("USER");
        rvDto.setOtp("123456");

        when(service.verifyOtp(anyString(), anyString()))
                .thenReturn(true);

        when(service.createUser(any(UserDTO.class)))
                .thenReturn(user);

        User result =
                controller.verifyAndRegister(rvDto);

        assertNotNull(result);
    }

    @Test
    void testForgotPasswordOtp() {

        when(service.sendForgotPasswordOtp(anyString()))
                .thenReturn("OTP sent successfully");

        String result =
                controller.sendForgotOtp("abc@gmail.com")
                        .getBody();

        assertEquals("OTP sent successfully", result);
    }

    @Test
    void testVerifyForgotOtp() {

        OtpVerifyDTO vDto =
                new OtpVerifyDTO();

        vDto.setEmail("abc@gmail.com");
        vDto.setOtp("123456");

        when(service.verifyForgotOtp(any()))
                .thenReturn("OTP verified");

        String result =
                controller.verifyForgotOtp(vDto)
                        .getBody();

        assertEquals("OTP verified", result);
    }

    @Test
    void testResetPassword() {

        ResetPasswordDTO rDto =
                new ResetPasswordDTO();

        rDto.setEmail("abc@gmail.com");
        rDto.setNewPassword("123");
        rDto.setConfirmPassword("123");

        when(service.resetPassword(any()))
                .thenReturn("Password updated successfully");

        String result =
                controller.resetPassword(rDto)
                        .getBody();

        assertEquals("Password updated successfully",
                result);
    }

    @Test
    void testControllerTestEndpoint() {

        String result = controller.test();

        assertEquals("User Service Working", result);
    }
}
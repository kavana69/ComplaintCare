package com.user.service;

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
import com.user.dto.NotificationDTO;
import com.user.dto.OtpVerifyDTO;

import com.user.dto.ResetPasswordDTO;
import com.user.dto.UserDTO;
import com.user.entity.User;
import com.user.exception.UserNotFoundException;
import com.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repo;

    @Mock
    private NotificationClient notificationClient;

    @Mock
    private AuthClient authClient;

    @InjectMocks
    private UserService service;

    private User user;
    private UserDTO dto;

    @BeforeEach
    void setup() {

        user = new User();
        user.setId(1L);
        user.setName("Kavana");
        user.setEmail("abc@gmail.com");
        user.setPassword("123");
        user.setRole("USER");

        dto = new UserDTO();
        dto.setName("Kavana");
        dto.setEmail("abc@gmail.com");
        dto.setPassword("123");
        dto.setRole("USER");
    }

    @Test
    void testCreateUserSuccess() {

        when(repo.save(any(User.class))).thenReturn(user);

        User result = service.createUser(dto);

        assertNotNull(result);
        assertEquals("Kavana", result.getName());
    }

    @Test
    void testCreateUserEmptyName() {

        dto.setName("");

        assertThrows(IllegalArgumentException.class,
                () -> service.createUser(dto));
    }

    @Test
    void testCreateUserEmptyEmail() {

        dto.setEmail("");

        assertThrows(IllegalArgumentException.class,
                () -> service.createUser(dto));
    }

    @Test
    void testGetUserByEmailSuccess() {

        when(repo.findByEmail(anyString()))
                .thenReturn(Optional.of(user));

        User result = service.getUserByEmail("abc@gmail.com");

        assertNotNull(result);
        assertEquals("abc@gmail.com", result.getEmail());
    }

    @Test
    void testGetUserByEmailNotFound() {

        when(repo.findByEmail(anyString()))
                .thenReturn(Optional.empty());

        User result = service.getUserByEmail("abc@gmail.com");

        assertNull(result);
    }

    @Test
    void testGetAllUsers() {

        List<User> list = Arrays.asList(user);

        when(repo.findAll()).thenReturn(list);

        List<User> result = service.getAllUsers();

        assertEquals(1, result.size());
    }

    @Test
    void testGetUserByIdSuccess() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(user));

        User result = service.getUserById(1L);

        assertNotNull(result);
    }

    @Test
    void testGetUserByIdNotFound() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> service.getUserById(1L));
    }

    @Test
    void testDeleteUserSuccess() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(user));

        String result = service.deleteUser(1L);

        verify(repo).delete(any(User.class));

        assertEquals("User Deleted Successfully", result);
    }

    @Test
    void testDeleteUserNotFound() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> service.deleteUser(1L));
    }

    @Test
    void testGenerateOtp() {

        String otp = service.generateOtp("abc@gmail.com");

        assertNotNull(otp);
        assertEquals(6, otp.length());
    }

    @Test
    void testVerifyOtpTrue() {

        String otp = service.generateOtp("abc@gmail.com");

        boolean result =
                service.verifyOtp("abc@gmail.com", otp);

        assertTrue(result);
    }

    @Test
    void testVerifyOtpFalse() {

        service.generateOtp("abc@gmail.com");

        boolean result =
                service.verifyOtp("abc@gmail.com", "999999");

        assertFalse(result);
    }

    @Test
    void testSendForgotPasswordOtpSuccess() {

        when(repo.findByEmail(anyString()))
                .thenReturn(Optional.of(user));

        String result =
                service.sendForgotPasswordOtp("abc@gmail.com");

        verify(notificationClient)
                .sendNotification(any(NotificationDTO.class));

        assertEquals("OTP sent successfully", result);
    }

    @Test
    void testSendForgotPasswordOtpUserNotFound() {

        when(repo.findByEmail(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service.sendForgotPasswordOtp("abc@gmail.com"));
    }

    @Test
    void testVerifyForgotOtpExpired() {

        OtpVerifyDTO otpDto = new OtpVerifyDTO();
        otpDto.setEmail("abc@gmail.com");
        otpDto.setOtp("123456");

        String result = service.verifyForgotOtp(otpDto);

        assertEquals("OTP expired", result);
    }

    @Test
    void testVerifyForgotOtpInvalid() {

        when(repo.findByEmail(anyString()))
                .thenReturn(Optional.of(user));

        service.sendForgotPasswordOtp("abc@gmail.com");

        OtpVerifyDTO vDto = new OtpVerifyDTO();
        vDto.setEmail("abc@gmail.com");
        vDto.setOtp("999999");

        String result = service.verifyForgotOtp(vDto);

        assertEquals("Invalid OTP", result);
    }

    @Test
    void testResetPasswordMismatch() {

        ResetPasswordDTO reDto = new ResetPasswordDTO();

        reDto.setEmail("abc@gmail.com");
        reDto.setNewPassword("123");
        reDto.setConfirmPassword("456");

        String result = service.resetPassword(reDto);

        assertEquals("Passwords do not match", result);
    }

    @Test
    void testResetPasswordSuccess() {

        ResetPasswordDTO rDto = new ResetPasswordDTO();

        rDto.setEmail("abc@gmail.com");
        rDto.setNewPassword("123");
        rDto.setConfirmPassword("123");

        when(repo.findByEmail(anyString()))
                .thenReturn(Optional.of(user));

        when(repo.save(any(User.class)))
                .thenReturn(user);

        String result = service.resetPassword(rDto);

        verify(authClient).updatePassword(any());

        assertEquals("Password updated successfully", result);
    }

    }
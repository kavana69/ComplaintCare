package com.notification.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.notification.dto.NotificationDTO;
import com.notification.entity.Notification;
import com.notification.service.NotificationService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationService service;

    @InjectMocks
    private NotificationController controller;

    @Test
    void testSendEndpoint() {

        NotificationDTO dto =
                new NotificationDTO();

        dto.setEmail("test@gmail.com");
        dto.setMessage("OTP");

        Notification notification =
                new Notification();

        notification.setEmail(dto.getEmail());
        notification.setMessage(dto.getMessage());

        when(service.sendNotification(any()))
                .thenReturn(notification);

        NotificationDTO result =
                controller.send(dto);

        assertEquals(
                "test@gmail.com",
                result.getEmail()
        );
    }

    @Test
    void testGetAllEndpoint() {

        List<Notification> list =
                Arrays.asList(
                        new Notification(),
                        new Notification()
                );

        when(service.getAllNotifications())
                .thenReturn(list);

        List<Notification> result =
                controller.getAll();

        assertEquals(2, result.size());
    }

    @Test
    void testGetByEmailEndpoint() {

        List<Notification> list =
                Arrays.asList(
                        new Notification()
                );

        when(service.getByEmail(anyString()))
                .thenReturn(list);

        List<Notification> result =
                controller.getByEmail(
                        "test@gmail.com"
                );

        assertEquals(1, result.size());
    }
    

    @Test
    void testControllerSendAnotherNotification() {

        NotificationDTO dto =
                new NotificationDTO();

        dto.setEmail("hello@gmail.com");
        dto.setMessage("HELLO");

        Notification saved =
                new Notification();

        saved.setEmail(dto.getEmail());
        saved.setMessage(dto.getMessage());

        when(service.sendNotification(any()))
                .thenReturn(saved);

        NotificationDTO result =
                controller.send(dto);

        assertEquals(
                "HELLO",
                result.getMessage());
    }

    @Test
    void testControllerGetAllEmpty() {

        when(service.getAllNotifications())
                .thenReturn(new ArrayList<>());

        List<Notification> result =
                controller.getAll();

        assertTrue(result.isEmpty());
    }

    @Test
    void testControllerGetByEmailEmpty() {

        when(service.getByEmail(anyString()))
                .thenReturn(new ArrayList<>());

        List<Notification> result =
                controller.getByEmail("abc@gmail.com");

        assertTrue(result.isEmpty());
    }
}
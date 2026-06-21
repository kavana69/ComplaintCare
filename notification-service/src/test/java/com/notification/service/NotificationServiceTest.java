package com.notification.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.notification.dto.NotificationDTO;
import com.notification.entity.Notification;
import com.notification.repository.NotificationRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository repo;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private NotificationService service;

    @Test
    void testSendNotificationSuccess() {

        NotificationDTO dto =
                new NotificationDTO();

        dto.setEmail("test@gmail.com");
        dto.setMessage("OTP");

        Notification notification =
                new Notification();

        notification.setEmail(dto.getEmail());
        notification.setMessage(dto.getMessage());

        when(repo.save(any()))
                .thenReturn(notification);

        Notification result =
                service.sendNotification(dto);

        assertNotNull(result);

        verify(mailSender)
                .send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendNotificationEmptyEmail() {

        NotificationDTO dto =
                new NotificationDTO();

        dto.setEmail("");
        dto.setMessage("OTP");

        assertThrows(
                IllegalArgumentException.class,
                () -> service.sendNotification(dto)
        );
    }

    @Test
    void testSendNotificationEmptyMessage() {

        NotificationDTO dto =
                new NotificationDTO();

        dto.setEmail("test@gmail.com");
        dto.setMessage("");

        assertThrows(
                IllegalArgumentException.class,
                () -> service.sendNotification(dto)
        );
    }

    @Test
    void testGetAllNotifications() {

        List<Notification> list =
                Arrays.asList(
                        new Notification(),
                        new Notification()
                );

        when(repo.findAll())
                .thenReturn(list);

        List<Notification> result =
                service.getAllNotifications();

        assertEquals(2, result.size());
    }

    @Test
    void testDeleteNotificationSuccess() {

        when(repo.existsById(anyLong()))
                .thenReturn(true);

        String result =
                service.deleteNotification(1L);

        verify(repo).deleteById(anyLong());

        assertEquals(
                "Notification deleted successfully",
                result
        );
    }

    @Test
    void testDeleteNotificationNotFound() {

        when(repo.existsById(anyLong()))
                .thenReturn(false);

        assertThrows(
                IllegalArgumentException.class,
                () -> service.deleteNotification(1L)
        );
    }
    @Test
    void testSendNotificationWithLongMessage() {

        NotificationDTO dto =
                new NotificationDTO();

        dto.setEmail("test@gmail.com");
        dto.setMessage(
                "This is a very long notification message for testing purpose");

        Notification notification =
                new Notification();

        notification.setEmail(dto.getEmail());
        notification.setMessage(dto.getMessage());

        when(repo.save(any(Notification.class)))
                .thenReturn(notification);

        Notification result =
                service.sendNotification(dto);

        assertNotNull(result);
        assertEquals(dto.getMessage(),
                result.getMessage());
    }

    @Test
    void testGetAllNotificationsEmptyList() {

        when(repo.findAll())
                .thenReturn(new ArrayList<>());

        List<Notification> result =
                service.getAllNotifications();

        assertTrue(result.isEmpty());
    }

    @Test
    void testDeleteNotificationAnotherId() {

        when(repo.existsById(anyLong()))
                .thenReturn(true);

        String result =
                service.deleteNotification(10L);

        verify(repo).deleteById(10L);

        assertEquals(
                "Notification deleted successfully",
                result);
    }
    
}
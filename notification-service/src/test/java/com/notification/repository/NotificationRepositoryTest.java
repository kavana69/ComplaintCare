package com.notification.repository;

import com.notification.entity.Notification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationRepositoryTest {

    @Mock
    private NotificationRepository repo;

    @Test
    void testSaveAndFind() {

        Notification n = new Notification();
        n.setMessage("Test");

        when(repo.save(any())).thenReturn(n);
        when(repo.findAll()).thenReturn(List.of(n));

        Notification saved = repo.save(n);
        List<Notification> list = repo.findAll();

        assertNotNull(saved);
        assertFalse(list.isEmpty());
    }
}
package com.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.notification.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByEmail(String email);
}
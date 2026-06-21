package com.user.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.user.dto.NotificationDTO;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationClient {

    @PostMapping("/notifications")
    NotificationDTO sendNotification(
            @RequestBody NotificationDTO dto
    );
}
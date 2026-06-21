package com.complaint.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.complaint.dto.NotificationDTO;

@FeignClient(name = "NOTIFICATION-SERVICE",fallback = NotificationFallback.class)
public interface NotificationClient {

    @PostMapping("/notifications")
    NotificationDTO sendNotification(@RequestBody NotificationDTO dto);
    }
package com.notification.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.notification.dto.NotificationDTO;
import com.notification.entity.Notification;
import com.notification.service.NotificationService;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

	private final NotificationService service;

	public NotificationController(NotificationService service) {
	    this.service = service;
	}

    // SEND
	@PostMapping
	public NotificationDTO send(@RequestBody NotificationDTO dto) {

	    Notification saved = service.sendNotification(dto);

	    NotificationDTO response = new NotificationDTO();
	    response.setMessage(saved.getMessage());
	    response.setEmail(saved.getEmail());

	    return response;
	}

    // GET ALL
    @GetMapping
    public List<Notification> getAll() {
        return service.getAllNotifications();
    }

    // GET BY USER
    @GetMapping("/email/{email}")
    public List<Notification> getByEmail(@PathVariable String email) {
        return service.getByEmail(email);
    }
}
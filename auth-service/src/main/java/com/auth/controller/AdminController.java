package com.auth.controller;

import java.util.List;


import org.springframework.web.bind.annotation.*;

import com.auth.entity.AuthUser;
import com.auth.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

	private final AdminService adminService;

	public AdminController(AdminService adminService) {
	    this.adminService = adminService;
	}

    @GetMapping("/users")
    public List<AuthUser> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/block/{id}")
    public String blockUser(@PathVariable Long id) {
        return adminService.blockUser(id);
    }

    @PutMapping("/activate/{id}")
    public String activateUser(@PathVariable Long id) {
        return adminService.activateUser(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        return adminService.deleteUser(id);
    }
}
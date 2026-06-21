package com.complaint.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.complaint.dto.User;

@FeignClient(name = "USER-SERVICE") 
public interface UserClient {
	@GetMapping("/users/{id}")
    User getUserById(@PathVariable Long id);

    @GetMapping("users/email/{email}")
    User getUserByEmail(@PathVariable String email);
}
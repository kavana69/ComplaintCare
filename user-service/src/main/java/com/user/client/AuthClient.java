package com.user.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;

import com.user.dto.ResetPasswordDTO;
import com.user.dto.UserDTO;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthClient {

    @PostMapping("/auth/register")
    String register(@RequestBody UserDTO dto);
    
    @PutMapping("/auth/update-password")
    String updatePassword(@RequestBody ResetPasswordDTO dto);
}
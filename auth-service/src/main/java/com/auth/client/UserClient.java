package com.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.auth.dto.UserDto;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {

    @PostMapping("/users")
    void  saveUser(@RequestBody UserDto user);
    
}

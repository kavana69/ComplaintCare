package com.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.admin.dto.ComplaintDTO;

@FeignClient(name = "COMPLAINT-SERVICE")
public interface ComplaintClient {

    @PutMapping("/complaints/{id}/status")
    String updateStatus(@PathVariable Long id,
                        @RequestParam String status);
    
    @PutMapping("/complaints/assign/{id}/{adminId}")
    ComplaintDTO assign(@PathVariable Long id,
                     @PathVariable Long adminId);
}

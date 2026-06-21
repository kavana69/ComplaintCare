package com.admin.controller;
import java.util.List;


import org.springframework.web.bind.annotation.*;

import com.admin.dto.AdminActionDTO;
import com.admin.dto.AdminDto;
import com.admin.dto.ComplaintDTO;
import com.admin.entity.Admin;
import com.admin.entity.AdminAction;
import com.admin.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

 
    private final AdminService service;
    public AdminController(AdminService service) {
    	this.service=service;
    }
    @PostMapping("/create")
    public Admin createAdmin(@RequestBody AdminDto dto) {
        return service.saveAdmin(dto);
    }
    @PostMapping("/action")
    public AdminAction create(@RequestBody AdminActionDTO dto) {
        return service.assignComplaint(dto);
    }
    // ASSIGN COMPLAINT
    @PostMapping("/assign")
    public AdminAction assign(@RequestBody AdminActionDTO dto) {
        return service.assignComplaint(dto);
    }
    @PutMapping("/assign/{complaintId}/{adminId}")
    public ComplaintDTO assign(@PathVariable Long complaintId,
                               @PathVariable Long adminId) {
        return service.assignComplaint(complaintId, adminId);
    }
    // GET ALL
    @GetMapping
    public List<AdminAction> getAll() {
        return service.getAllActions();
    }

    // UPDATE PRIORITY
    @PutMapping("/{id}/priority")
    public AdminAction updatePriority(@PathVariable Long id,
                                      @RequestParam String priority) {
        return service.updatePriority(id, priority);
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public AdminAction updateStatus(@PathVariable Long id,
                                    @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    // RESOLVE
    @PutMapping("/resolve/{id}")
    public AdminAction resolve(@PathVariable Long id) {
        return service.resolve(id);
    }
}
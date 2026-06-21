package com.admin.service;
import java.util.List;


import org.springframework.stereotype.Service;

import com.admin.client.ComplaintClient;
import com.admin.dto.AdminActionDTO;
import com.admin.dto.AdminDto;
import com.admin.dto.ComplaintDTO;
import com.admin.entity.Admin;
import com.admin.entity.AdminAction;
import com.admin.exception.AdminNotFoundException;
import com.admin.repository.AdminActionRepository;
import com.admin.repository.AdminRepository;
@Service
public class AdminService {

   
    private final  AdminRepository adminRepo;
    private final  AdminActionRepository actionRepo;
    private final ComplaintClient complaintClient;

    public AdminService(AdminRepository adminRepo,
                        AdminActionRepository actionRepo,
                        ComplaintClient complaintClient) {
        this.adminRepo = adminRepo;
        this.actionRepo = actionRepo;
        this.complaintClient = complaintClient;
    }
    private static final String ACTION_NOT_FOUND =
            "Action not found with id: ";
    public Admin saveAdmin(AdminDto dto) {
    	 if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
             throw new IllegalArgumentException("Email cannot be empty");
         }
        Admin admin = new Admin();
        admin.setName(dto.getName());
        admin.setEmail(dto.getEmail());
        String role = dto.getRole();

        if (!role.isEmpty() && role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        admin.setRole(role.toUpperCase());
        return adminRepo.save(admin);
    }
    public ComplaintDTO assignComplaint(Long complaintId, Long adminId) {
        return complaintClient.assign(complaintId, adminId);
    }
    // ASSIGN COMPLAINT
    public AdminAction assignComplaint(AdminActionDTO dto) {
    	  if (dto.getStatus() == null || dto.getStatus().isEmpty()) {
              throw new IllegalArgumentException("Status cannot be empty");
          }
    	
        AdminAction action = new AdminAction();

        action.setStatus(dto.getStatus());
        action.setPriority(dto.getPriority());

        return actionRepo.save(action);
    }

    // GET ALL ACTIONS
    public List<AdminAction> getAllActions() {
        return actionRepo.findAll();
    }

    // UPDATE PRIORITY
    public AdminAction updatePriority(Long id, String priority) {
    	 AdminAction action = actionRepo.findById(id)
                 .orElseThrow(() ->
                         new AdminNotFoundException(ACTION_NOT_FOUND + id)
                 );
        action.setPriority(priority);
        return actionRepo.save(action);
    }

    // UPDATE STATUS
    public AdminAction updateStatus(Long id, String status) {
    	AdminAction action = actionRepo.findById(id)
                .orElseThrow(() ->
                        new AdminNotFoundException(ACTION_NOT_FOUND + id)
                );
        action.setStatus(status);
        return actionRepo.save(action);
    }

    // RESOLVE
    public AdminAction resolve(Long id) {
    	 AdminAction action = actionRepo.findById(id)
                 .orElseThrow(() ->
                         new AdminNotFoundException(ACTION_NOT_FOUND + id)
                 );
        action.setStatus("RESOLVED");
        return actionRepo.save(action);
    }
}
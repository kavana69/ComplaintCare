package com.complaint.controller;

import java.util.List;
import java.util.Map;


import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.complaint.dto.ComplaintDTO;
import com.complaint.entity.Complaint;
import com.complaint.security.JwtUtil;
import com.complaint.service.ComplaintService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/complaints")

public class ComplaintController {

private final JwtUtil jwtUtil;

	private final ComplaintService service;
	private static final Logger log =
	        LoggerFactory.getLogger(ComplaintController.class);

	public ComplaintController(
	        ComplaintService service,
	        JwtUtil jwtUtil) {

	    this.service = service;
	    this.jwtUtil = jwtUtil;
	}

    // CREATE
    @PostMapping
    public Complaint create(@Valid @RequestBody ComplaintDTO dto,@RequestHeader("Authorization") String token) {
    	if (token == null || !token.startsWith("Bearer ")) {
    	    throw new IllegalArgumentException("Invalid token");
    	}

    	String jwt = token.substring(7);
    	String email = jwtUtil.extractUsername(jwt);
    	log.info("Received request to create complaint");
        return service.createComplaint(dto,email);
    }

    // GET ALL
    @GetMapping
    public List<Complaint> getAll() {
        return service.getAllComplaints();
    }

    // GET BY USER
    @GetMapping("/user/{userId}")
    public List<Complaint> getByUser(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }
    @GetMapping("/email/{email}")
    public List<Complaint> getByEmail(
            @PathVariable String email) {

        return service.getByEmail(email);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Complaint getById(@PathVariable Long id) {
        return service.getComplaintById(id);
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public Complaint updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        log.info("Received request to update complaint status");

        return service.updateStatus(id, status);
    }

    @PutMapping("/assign/{id}/{adminId}")
    public Complaint assign(@PathVariable Long id,
                            @PathVariable Long adminId) {

        return service.assignToAdmin(id, adminId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        return service.deleteComplaint(id);
    }
}
package com.admin.entity;

import jakarta.persistence.*;

@Entity
public class AdminAction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long complaintId;
    private String priority;   // LOW, MEDIUM, HIGH
    private String status;     // ASSIGNED, IN_PROGRESS, RESOLVED

    // Getters & Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getComplaintId() { return complaintId; }

    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public String getPriority() { return priority; }

    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }
}
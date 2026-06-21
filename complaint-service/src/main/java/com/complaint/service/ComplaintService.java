package com.complaint.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.complaint.client.UserClient;
import com.complaint.dto.ComplaintDTO;
import com.complaint.dto.NotificationDTO;
import com.complaint.dto.User;
import com.complaint.entity.Complaint;
import com.complaint.entity.ComplaintStatus;
import com.complaint.exception.ResourceNotFoundException;
import com.complaint.kafka.KafkaProducerService;
import com.complaint.repository.ComplaintRepository;

@Service
public class ComplaintService {

	 private final UserClient userClient;
	    private final KafkaProducerService kafkaProducerService;
	    private final ComplaintRepository repo;

	    private static final Logger log =
	            LoggerFactory.getLogger(ComplaintService.class);

	    private static final String COMPLAINT_NOT_FOUND =
	            "Complaint not found";

	    private static final String NOTIFICATION_FAILED =
	            "Notification sending failed";

	    public ComplaintService(
	            UserClient userClient,
	            KafkaProducerService kafkaProducerService,
	            ComplaintRepository repo) {

	        this.userClient = userClient;
	        this.kafkaProducerService = kafkaProducerService;
	        this.repo = repo;
	    }

    // CREATE COMPLAINT
    public Complaint createComplaint(ComplaintDTO dto, String email) {

        User user = userClient.getUserByEmail(email);
        log.info("Creating complaint for user: {}", email);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Complaint complaint = new Complaint();

        complaint.setTitle(dto.getTitle());
        complaint.setDescription(dto.getDescription());
        complaint.setUserId(user.getId());
        complaint.setStatus(ComplaintStatus.OPEN);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        Complaint saved = repo.save(complaint);
        log.info("Complaint created successfully with ID: {}", saved.getId());

        // SEND NOTIFICATION
        try {

            NotificationDTO notificationDTO = new NotificationDTO();

            notificationDTO.setEmail(email);

            notificationDTO.setMessage(
                "Complaint created: " + saved.getTitle()
            );

           
            kafkaProducerService.sendNotification(notificationDTO);

        } catch (Exception e) {

        	log.error(NOTIFICATION_FAILED, e);
        }

        return saved;
    }

    // UPDATE COMPLAINT
    public Complaint update(Complaint c) {
        if (c == null) {
            throw new IllegalStateException(
                "Complaint cannot be null"
            );
        }
        c.setUpdatedAt(LocalDateTime.now());
        return repo.save(c);
    }
    // GET ALL
    public List<Complaint> getAllComplaints() {
        return repo.findAll();
    }
    // GET BY USER
    public List<Complaint> getByUserId(Long userId) {
        return repo.findByUserId(userId);
    }
    public List<Complaint> getByEmail(String email) {
        User user = userClient.getUserByEmail(email);
        return repo.findByUserId(user.getId());
    }
    // GET BY ID
    public Complaint getComplaintById(Long id) {

        return repo.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                    		COMPLAINT_NOT_FOUND
                    )
                );
    }
    // UPDATE STATUS
    public Complaint updateStatus(Long id, String status) {
    	log.info("Updating complaint status for complaint ID: {}", id);

        Complaint complaint = repo.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                    		COMPLAINT_NOT_FOUND
                    )
                );

        try {

            complaint.setStatus(
                ComplaintStatus.valueOf(
                    status.toUpperCase()
                )
            );

        } catch (Exception e) {

            throw new IllegalArgumentException(
                "Invalid status"
            );
        }

        complaint.setUpdatedAt(LocalDateTime.now());
        Complaint updated = repo.save(complaint);
        log.info("Complaint status updated to {}", updated.getStatus());

        // SEND NOTIFICATION
        try {
            NotificationDTO dto = new NotificationDTO();
            Long userId = updated.getUserId();
            User user = userClient.getUserById(userId);
            dto.setEmail(user.getEmail());

            dto.setMessage(
                "Complaint status updated to: "
                + updated.getStatus()
            );
            
            kafkaProducerService.sendNotification(dto);
        } catch (Exception e) {

        	log.error(NOTIFICATION_FAILED, e);
        }

        return updated;
    }

    // ASSIGN TO ADMIN
    public Complaint assignToAdmin(Long id, Long adminId) {
    	log.info("Assigning complaint {} to admin {}", id, adminId);

        Complaint complaint = repo.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                    		COMPLAINT_NOT_FOUND
                    )
                );

        complaint.setAdminId(adminId);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        complaint.setUpdatedAt(LocalDateTime.now());
        Complaint updated = repo.save(complaint);
        log.info("Complaint assigned successfully");
        // SEND NOTIFICATION
        try {
            NotificationDTO dto = new NotificationDTO();
            Long userId = updated.getUserId();
            User user = userClient.getUserById(userId);
            dto.setEmail(user.getEmail());
            dto.setMessage(
                "Your complaint has been assigned to admin: "
                + adminId
            );
           
            kafkaProducerService.sendNotification(dto);
        } catch (Exception e) {
        	log.error(NOTIFICATION_FAILED, e);
        }
        return updated;
    }
    // DELETE
    public String deleteComplaint(Long id) {
        Complaint complaint = repo.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                    		COMPLAINT_NOT_FOUND
                    )
                );
        log.warn("Deleting complaint with ID: {}", id);

        repo.delete(complaint);

        return "Complaint deleted successfully";
    }
}
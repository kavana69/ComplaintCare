package com.notification.service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.notification.dto.NotificationDTO;
import com.notification.entity.Notification;
import com.notification.repository.NotificationRepository;

@Service
public class NotificationService {

	private final NotificationRepository repo;
	private final JavaMailSender mailSender;

	public NotificationService(NotificationRepository repo,
            JavaMailSender mailSender) {
this.repo = repo;
this.mailSender = mailSender;
}
	private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    // SEND NOTIFICATION
	public Notification sendNotification(NotificationDTO dto) {

		if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
	        throw new IllegalArgumentException("Email cannotmpty be e");
	    }

	    if (dto.getMessage() == null || dto.getMessage().isEmpty()) {
	        throw new IllegalArgumentException("Message cannot be empty");
	    }

	    Notification notification = new Notification();
	    notification.setMessage(dto.getMessage());
	    notification.setEmail(dto.getEmail());
	    notification.setTimestamp(LocalDateTime.now());
	    
	    SimpleMailMessage mail = new SimpleMailMessage();
	    mail.setTo(dto.getEmail());
	    mail.setSubject("Complaint Care OTP");
	    mail.setText(dto.getMessage());
	    mailSender.send(mail);

	    log.info("Notification sent: {}", notification.getMessage());

	    return repo.save(notification);
	}

    // GET ALL
    public List<Notification> getAllNotifications() {
        return repo.findAll();
    }
    public String deleteNotification(Long id) {

        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Notification not found");
        }

        repo.deleteById(id);
        return "Notification Deleted";
    }

    // GET BY USER
    public List<Notification> getByEmail(String email) {
        return repo.findByEmail(email);
    }
}
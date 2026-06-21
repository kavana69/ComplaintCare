package com.complaint.client;

import org.springframework.stereotype.Component;
import com.complaint.dto.NotificationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class NotificationFallback implements NotificationClient {
	private static final Logger log =
	        LoggerFactory.getLogger(NotificationFallback.class);

    @Override
    public NotificationDTO sendNotification(NotificationDTO dto) {
        log.warn("Notification service DOWN. Saving skipped.");
        return dto; // fallback response
    }
}
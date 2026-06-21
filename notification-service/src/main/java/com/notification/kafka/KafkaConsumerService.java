package com.notification.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.notification.dto.NotificationDTO;
import com.notification.service.NotificationService;

@Service
public class KafkaConsumerService {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    private static final Logger log =
            LoggerFactory.getLogger(KafkaConsumerService.class);

    public KafkaConsumerService(NotificationService notificationService,
                                ObjectMapper objectMapper) {
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(
            topics = "notification-topic",
            groupId = "notification-group"
    )
    public void consume(String message) {

        try {

            NotificationDTO dto =
                    objectMapper.readValue(message, NotificationDTO.class);

            log.info("Message received from Kafka");

            notificationService.sendNotification(dto);

        } catch (Exception e) {

            log.error("Error while consuming Kafka message", e);
        }
    }
}
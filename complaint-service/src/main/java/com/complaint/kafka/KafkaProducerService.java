package com.complaint.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.complaint.dto.NotificationDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class KafkaProducerService {

    private static final String TOPIC = "notification-topic";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final Logger log =
            LoggerFactory.getLogger(KafkaProducerService.class);

    public KafkaProducerService(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper) {

        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendNotification(NotificationDTO dto) {

        try {

            String json = objectMapper.writeValueAsString(dto);

            kafkaTemplate.send(TOPIC, json);

            log.info("Message sent to Kafka topic: {}", TOPIC);

        } catch (Exception e) {

            log.error("Failed to send Kafka message", e);
        }
    }
}
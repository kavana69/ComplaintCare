package com.complaint.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.complaint.dto.ChatRequestDTO;
import com.complaint.service.GeminiService;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin("*")
public class ChatBotController {

	private final GeminiService geminiService;

	public ChatBotController(GeminiService geminiService) {
	    this.geminiService = geminiService;
	}

    @PostMapping("/message")
    public Map<String, String> chat(@RequestBody ChatRequestDTO dto) {

        String userMessage = dto.getMessage();

        String aiReply = geminiService.getReply(userMessage);

        Map<String, String> response = new HashMap<>();

        response.put("reply", aiReply);

        return response;
    }
}
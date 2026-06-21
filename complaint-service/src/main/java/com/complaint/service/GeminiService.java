package com.complaint.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

	@Value("${gemini.api.key}")
	private String apiKey;

	public String getReply(String message) {

		try {

			String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key="
					+ apiKey;
			String body = """
					{
					  "contents": [{
					    "parts": [{
					      "text": "You are an AI customer support assistant for a Complaint Management System web application. Your role is to help users with login issues, registration problems, complaint status, password reset, account updates, and technical support. Always reply professionally, politely, and in short readable paragraphs. Avoid markdown symbols, stars, hashtags, and unnecessary formatting. User message: %s"
					    }]
					  }]
					}
					"""
					.formatted(message);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<String> request = new HttpEntity<>(body, headers);

			RestTemplate restTemplate = new RestTemplate();

			ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

			String responseBody = response.getBody();
			if (responseBody == null) {
				throw new IllegalStateException("Empty response from Gemini API");
			}

			String reply = responseBody.split("\"text\": \"")[1].split("\"")[0];

			reply = reply.replace("\\n", "\n").replace("**", "").replace("###", "").replace("\\", "").trim();

			return reply;

		} catch (Exception e) {
			e.printStackTrace();
			return "AI assistant unavailable.";
		}
	}
}
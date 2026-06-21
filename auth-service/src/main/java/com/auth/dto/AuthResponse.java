package com.auth.dto;

public class AuthResponse {

    private String message;
    private Object data;

    public AuthResponse(String message, Object data) {
        this.message = message;
        this.data = data;
    }

    public String getMessage() { return message; }
    public Object getData() { return data; }
}
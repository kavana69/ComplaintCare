package com.auth.dto;

public class LoginResponse {
    private String email;
    private String token;

    public LoginResponse(String email, String token) {
        this.setEmail(email);
        this.setToken(token);
    }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

    // getters
}

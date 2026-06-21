package com.auth.service;
import com.auth.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth.client.AdminClient;
import com.auth.client.UserClient;
import com.auth.dto.AdminDto;
import com.auth.dto.RegisterRequest;
import com.auth.dto.ResetPasswordDTO;
import com.auth.dto.UserDto;
import com.auth.entity.AuthUser;
import com.auth.repository.AuthUserRepository;

@Service
public class AuthService {

	private final AuthUserRepository repo;
	private final PasswordEncoder passwordEncoder;
	private final UserClient userClient;
	private final AdminClient adminClient;
	private final JwtUtil jwtUtil;

	public AuthService(AuthUserRepository repo,
	                   PasswordEncoder passwordEncoder,
	                   UserClient userClient,
	                   AdminClient adminClient,
	                   JwtUtil jwtUtil) {
	    this.repo = repo;
	    this.passwordEncoder = passwordEncoder;
	    this.userClient = userClient;
	    this.adminClient=adminClient;
	    this.jwtUtil = jwtUtil;
	}

   
    public AuthUser register(RegisterRequest request) {

      
        if (request.getEmail() == null || request.getPassword() == null || request.getName() == null) {
            throw new IllegalStateException("Name, Email or Password is null");
        }
        AuthUser existing = repo.findByEmail(request.getEmail());
        if (existing != null) {
            throw new IllegalStateException("User already exists. Please login.");
        }
        AuthUser user = new AuthUser();
        user.setUsername(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase()); 
        user.setStatus("ACTIVE");

      
        AuthUser savedUser = repo.save(user);

      
        if ("USER".equalsIgnoreCase(savedUser.getRole())) {

            UserDto dto = new UserDto();
            dto.setName(request.getName());
            dto.setEmail(request.getEmail());
            dto.setRole(savedUser.getRole());

            userClient.saveUser(dto);
        }

        else if ("ADMIN".equalsIgnoreCase(savedUser.getRole())) {

            AdminDto dto = new AdminDto();
            dto.setName(request.getName());
            dto.setEmail(request.getEmail());
            dto.setRole(savedUser.getRole());

            adminClient.saveAdmin(dto);
        }

        return savedUser;
    }

    public String login( String email,String password) {

        AuthUser existing = repo.findByEmail(email);

        if (existing == null) {
            throw new IllegalStateException("User not found");
        }

        if (!passwordEncoder.matches(password, existing.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return jwtUtil.generateToken(existing.getEmail(),existing.getRole());
    }
    public String updatePassword(ResetPasswordDTO dto) {
        AuthUser user = repo.findByEmail(dto.getEmail());

        if (user == null) {
            return "User not found";
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        repo.save(user);

        return "Password updated";
    }
}
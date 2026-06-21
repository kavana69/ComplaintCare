package com.auth.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.auth.entity.AuthUser;
import com.auth.repository.AuthUserRepository;

@Service
public class AdminService {

	private final AuthUserRepository authUserRepository;

	public AdminService(AuthUserRepository authUserRepository) {
	    this.authUserRepository = authUserRepository;
	}

    public List<AuthUser> getAllUsers() {
        return authUserRepository.findAll();
    }

    public String blockUser(Long id) {

        AuthUser user = authUserRepository.findById(id).orElse(null);

        if (user == null) {
            return "User not found";
        }

        user.setStatus("BLOCKED");

        authUserRepository.save(user);

        return "User blocked successfully";
    }

    public String activateUser(Long id) {

        AuthUser user = authUserRepository.findById(id).orElse(null);

        if (user == null) {
            return "User not found";
        }

        user.setStatus("ACTIVE");

        authUserRepository.save(user);

        return "User activated successfully";
    }

    public String deleteUser(Long id) {

        authUserRepository.deleteById(id);

        return "User deleted successfully";
    }
}
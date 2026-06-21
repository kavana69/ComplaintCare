package com.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.auth.entity.AuthUser;


public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {
	AuthUser findByUsername(String username);
	AuthUser findByEmail(String email);
	List<AuthUser> findByStatus(String status);
}
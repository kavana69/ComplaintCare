package com.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.admin.entity.AdminAction;

public interface AdminActionRepository extends JpaRepository<AdminAction, Long> {
}
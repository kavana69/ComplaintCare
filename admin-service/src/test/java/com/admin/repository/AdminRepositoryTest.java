package com.admin.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import com.admin.entity.Admin;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class AdminRepositoryTest {

    @Autowired
    private AdminRepository repo;

    @Test
    void testSaveAndFind() {

        Admin admin = new Admin();
        admin.setName("Test Admin");
        admin.setEmail("test@gmail.com");
        admin.setRole("ADMIN");

        Admin saved = repo.save(admin);

        List<Admin> list = repo.findAll();

        assertNotNull(saved.getId());
        assertFalse(list.isEmpty());
    }
}
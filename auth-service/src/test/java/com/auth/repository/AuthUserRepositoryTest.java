package com.auth.repository;

import com.auth.entity.AuthUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class AuthUserRepositoryTest {

    @Autowired
    private AuthUserRepository repo;

    @Test
    void testSaveUser() {
        AuthUser user = new AuthUser();
        user.setUsername("kavana");
        user.setEmail("kavana@gmail.com");
        user.setPassword("1234");
        user.setRole("USER");

        AuthUser saved = repo.save(user);

        assertNotNull(saved.getId());
        assertEquals("kavana@gmail.com", saved.getEmail());
    }

    @Test
    void testFindByEmail() {
        AuthUser user = new AuthUser();
        user.setUsername("kavana");
        user.setEmail("kavana@gmail.com");
        user.setPassword("1234");
        user.setRole("USER");

        repo.save(user);

        AuthUser found = repo.findByEmail("kavana@gmail.com");

        assertNotNull(found);
        assertEquals("kavana", found.getUsername());
    }

    @Test
    void testFindByEmail_NotFound() {
        AuthUser found = repo.findByEmail("notfound@gmail.com");

        assertNull(found);
    }
}
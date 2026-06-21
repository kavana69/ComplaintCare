package com.user.repository;

import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.user.entity.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository repo;

    @Test
    void testSaveAndFind() {

        User user = new User();
        user.setName("kavana");
        user.setEmail("kavana@gmail.com");
        user.setRole("USER");

        repo.save(user);

        List<User> users = repo.findAll();

        assertFalse(users.isEmpty());
    }
}
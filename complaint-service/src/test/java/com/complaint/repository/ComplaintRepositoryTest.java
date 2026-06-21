package com.complaint.repository;

import com.complaint.entity.Complaint;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ComplaintRepositoryTest {

    @Autowired
    private ComplaintRepository repo;

    @Test
    void testSaveAndFind() {

        Complaint c = new Complaint();
        c.setTitle("Issue");

        repo.save(c);

        List<Complaint> list = repo.findAll();

        assertFalse(list.isEmpty());
    }
}
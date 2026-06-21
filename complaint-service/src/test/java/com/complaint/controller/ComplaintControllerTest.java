package com.complaint.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.*;

import com.complaint.dto.ComplaintDTO;
import com.complaint.entity.Complaint;
import com.complaint.service.ComplaintService;
import com.complaint.security.JwtUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ComplaintControllerTest {

    @Mock
    private ComplaintService service;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private ComplaintController controller;

    private Complaint complaint;

    @BeforeEach
    void setup() {

        complaint = new Complaint();
        complaint.setId(1L);
        complaint.setTitle("Issue");
        complaint.setDescription("Problem");
    }

    @Test
    void testCreateComplaint() {

        ComplaintDTO dto = new ComplaintDTO();
        dto.setTitle("Issue");
        dto.setDescription("Problem");

        when(jwtUtil.extractUsername(anyString()))
                .thenReturn("test@gmail.com");

        when(service.createComplaint(any(), anyString()))
                .thenReturn(complaint);

        Complaint result =
                controller.create(dto, "Bearer token");

        assertNotNull(result);
    }

    @Test
    void testCreateComplaintInvalidToken() {

        ComplaintDTO dto = new ComplaintDTO();

        assertThrows(IllegalArgumentException.class,
                () -> controller.create(dto, "wrong"));
    }

    @Test
    void testCreateComplaintNullToken() {

        ComplaintDTO dto = new ComplaintDTO();

        assertThrows(IllegalArgumentException.class,
                () -> controller.create(dto, null));
    }

    @Test
    void testGetAll() {

        List<Complaint> list =
                new ArrayList<>();

        list.add(complaint);

        when(service.getAllComplaints())
                .thenReturn(list);

        List<Complaint> result =
                controller.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void testGetByUser() {

        List<Complaint> list =
                new ArrayList<>();

        list.add(complaint);

        when(service.getByUserId(anyLong()))
                .thenReturn(list);

        List<Complaint> result =
                controller.getByUser(1L);

        assertNotNull(result);
    }

    @Test
    void testGetByEmail() {

        List<Complaint> list =
                new ArrayList<>();

        list.add(complaint);

        when(service.getByEmail(anyString()))
                .thenReturn(list);

        List<Complaint> result =
                controller.getByEmail("test@gmail.com");

        assertNotNull(result);
    }

    @Test
    void testGetById() {

        when(service.getComplaintById(anyLong()))
                .thenReturn(complaint);

        Complaint result =
                controller.getById(1L);

        assertNotNull(result);
    }

    

    @Test
    void testAssignAdmin() {

        when(service.assignToAdmin(anyLong(), anyLong()))
                .thenReturn(complaint);

        Complaint result =
                controller.assign(1L, 2L);

        assertNotNull(result);
    }

    @Test
    void testDeleteComplaint() {

        when(service.deleteComplaint(anyLong()))
                .thenReturn("Complaint deleted successfully");

        String result =
                controller.delete(1L);

        assertEquals(
                "Complaint deleted successfully",
                result);
    }
    @Test
    void testUpdateStatusClosed() {

        Map<String, String> map =
                new HashMap<>();

        map.put("status", "CLOSED");

        when(service.updateStatus(anyLong(), anyString()))
                .thenReturn(complaint);

        Complaint result =
                controller.updateStatus(1L, map);

        assertNotNull(result);
    }
    @Test
    void testGetByEmailEmpty() {

        when(service.getByEmail(anyString()))
                .thenReturn(new ArrayList<>());

        List<Complaint> result =
                controller.getByEmail("abc@gmail.com");

        assertTrue(result.isEmpty());
    }
    @Test
    void testGetByUserEmpty() {

        when(service.getByUserId(anyLong()))
                .thenReturn(new ArrayList<>());

        List<Complaint> result =
                controller.getByUser(1L);

        assertTrue(result.isEmpty());
    }
    @Test
    void testGetAllEmpty() {

        when(service.getAllComplaints())
                .thenReturn(new ArrayList<>());

        List<Complaint> result =
                controller.getAll();

        assertTrue(result.isEmpty());
    }
    @Test
    void testUpdateStatusResolved() {

        Map<String, String> map =
                new HashMap<>();

        map.put("status", "RESOLVED");

        when(service.updateStatus(anyLong(),
                anyString()))
                .thenReturn(complaint);

        Complaint result =
                controller.updateStatus(1L, map);

        assertNotNull(result);
    }
    @Test
    void testAssignEndpointDifferentAdmin() {

        when(service.assignToAdmin(5L, 10L))
                .thenReturn(complaint);

        Complaint result =
                controller.assign(5L, 10L);

        assertNotNull(result);
    }
    @Test
    void testGetByEmailAnotherMail() {

        when(service.getByEmail(anyString()))
                .thenReturn(Arrays.asList(complaint));

        List<Complaint> result =
                controller.getByEmail("new@gmail.com");

        assertEquals(1, result.size());
    }
    @Test
    void testGetByUserAnotherId() {

        when(service.getByUserId(anyLong()))
                .thenReturn(Arrays.asList(complaint));

        List<Complaint> result =
                controller.getByUser(99L);

        assertEquals(1, result.size());
    }
    @Test
    void testGetAllMultipleComplaints() {

        List<Complaint> list =
                Arrays.asList(
                        complaint,
                        complaint
                );

        when(service.getAllComplaints())
                .thenReturn(list);

        List<Complaint> result =
                controller.getAll();

        assertEquals(2, result.size());
    }
    @Test
    void testGetAllWithMultipleComplaints() {

        List<Complaint> list =
                Arrays.asList(
                        complaint,
                        new Complaint()
                );

        when(service.getAllComplaints())
                .thenReturn(list);

        List<Complaint> result =
                controller.getAll();

        assertEquals(2, result.size());
    }
   
    @Test
    void testAssignDifferentIds() {

        when(service.assignToAdmin(100L, 200L))
                .thenReturn(complaint);

        Complaint result =
                controller.assign(100L, 200L);

        assertNotNull(result);
    }
    @Test
    void testGetByIdAnotherComplaint() {

        Complaint another = new Complaint();
        another.setId(99L);

        when(service.getComplaintById(anyLong()))
                .thenReturn(another);

        Complaint result =
                controller.getById(99L);

        assertEquals(99L, result.getId());
    }
}
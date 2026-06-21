package com.complaint.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.*;

import com.complaint.client.UserClient;
import com.complaint.dto.ComplaintDTO;
import com.complaint.entity.Complaint;
import com.complaint.entity.ComplaintStatus;
import com.complaint.dto.User;
import com.complaint.exception.ResourceNotFoundException;
import com.complaint.kafka.KafkaProducerService;
import com.complaint.repository.ComplaintRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceTest {

    @Mock
    private ComplaintRepository repo;

    @Mock
    private UserClient userClient;

    @Mock
    private KafkaProducerService kafkaProducerService;

    @InjectMocks
    private ComplaintService service;

    private Complaint complaint;

    private User user;

    @BeforeEach
    void setup() {

        complaint = new Complaint();
        complaint.setId(1L);
        complaint.setTitle("Issue");
        complaint.setDescription("Problem");
        complaint.setStatus(ComplaintStatus.OPEN);

        user = new User();
        user.setId(1L);
        user.setEmail("test@gmail.com");
    }

    @Test
    void testCreateComplaint() {

        ComplaintDTO dto =
                new ComplaintDTO();

        dto.setTitle("Issue");
        dto.setDescription("Problem");

        when(userClient.getUserByEmail(anyString()))
                .thenReturn(user);

        when(repo.save(any()))
                .thenReturn(complaint);

        Complaint result =
                service.createComplaint(dto,
                        "test@gmail.com");

        assertNotNull(result);
    }

    @Test
    void testCreateComplaintUserNotFound() {

        ComplaintDTO dto =
                new ComplaintDTO();

        dto.setTitle("Issue");

        when(userClient.getUserByEmail(anyString()))
                .thenReturn(null);

        assertThrows(IllegalArgumentException.class,
                () -> service.createComplaint(
                        dto,
                        "test@gmail.com"));
    }

    @Test
    void testUpdateComplaint() {

        when(repo.save(any()))
                .thenReturn(complaint);

        Complaint result =
                service.update(complaint);

        assertNotNull(result);
    }

    @Test
    void testUpdateComplaintNull() {

        assertThrows(IllegalStateException.class,
                () -> service.update(null));
    }

    @Test
    void testGetAllComplaints() {

        List<Complaint> list =
                new ArrayList<>();

        list.add(complaint);

        when(repo.findAll())
                .thenReturn(list);

        List<Complaint> result =
                service.getAllComplaints();

        assertEquals(1, result.size());
    }

    @Test
    void testGetByUserId() {

        List<Complaint> list =
                new ArrayList<>();

        list.add(complaint);

        when(repo.findByUserId(anyLong()))
                .thenReturn(list);

        List<Complaint> result =
                service.getByUserId(1L);

        assertNotNull(result);
    }

    @Test
    void testGetByEmail() {

        List<Complaint> list =
                new ArrayList<>();

        list.add(complaint);

        when(userClient.getUserByEmail(anyString()))
                .thenReturn(user);

        when(repo.findByUserId(anyLong()))
                .thenReturn(list);

        List<Complaint> result =
                service.getByEmail(
                        "test@gmail.com");

        assertNotNull(result);
    }

    @Test
    void testGetComplaintById() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        Complaint result =
                service.getComplaintById(1L);

        assertNotNull(result);
    }

    @Test
    void testGetComplaintByIdNotFound() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.getComplaintById(1L));
    }

    @Test
    void testUpdateStatus() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        when(repo.save(any()))
                .thenReturn(complaint);

        Complaint result =
                service.updateStatus(
                        1L,
                        "OPEN");

        assertNotNull(result);
    }

    @Test
    void testUpdateStatusInvalid() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        assertThrows(IllegalArgumentException.class,
                () -> service.updateStatus(
                        1L,
                        "wrong"));
    }

    @Test
    void testAssignToAdmin() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        when(repo.save(any()))
                .thenReturn(complaint);

        when(userClient.getUserById(anyLong()))
                .thenReturn(user);

        Complaint result =
                service.assignToAdmin(
                        1L,
                        2L);

        assertNotNull(result);
    }

    @Test
    void testDeleteComplaint() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        String result =
                service.deleteComplaint(1L);

        verify(repo).delete(any());

        assertEquals(
                "Complaint deleted successfully",
                result);
    }

    @Test
    void testDeleteComplaintNotFound() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.deleteComplaint(1L));
    }
    @Test
    void testCreateComplaintNotificationException() {

        ComplaintDTO dto = new ComplaintDTO();
        dto.setTitle("Issue");
        dto.setDescription("Problem");

        when(userClient.getUserByEmail(anyString()))
                .thenReturn(user);

        when(repo.save(any()))
                .thenReturn(complaint);

        doThrow(new RuntimeException())
                .when(kafkaProducerService)
                .sendNotification(any());

        Complaint result =
                service.createComplaint(dto,
                        "test@gmail.com");

        assertNotNull(result);
    }
    @Test
    void testUpdateStatusNotFound() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.updateStatus(1L, "OPEN"));
    }
    @Test
    void testAssignAdminNotFound() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.assignToAdmin(1L, 2L));
    }
    @Test
    void testAssignAdminNotificationException() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        when(repo.save(any()))
                .thenReturn(complaint);

        when(userClient.getUserById(anyLong()))
                .thenReturn(user);

        doThrow(new RuntimeException())
                .when(kafkaProducerService)
                .sendNotification(any());

        Complaint result =
                service.assignToAdmin(1L, 2L);

        assertNotNull(result);
    }
    @Test
    void testUpdateStatusNotificationException() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        when(repo.save(any()))
                .thenReturn(complaint);

        when(userClient.getUserById(anyLong()))
                .thenReturn(user);

        doThrow(new RuntimeException())
                .when(kafkaProducerService)
                .sendNotification(any());

        Complaint result =
                service.updateStatus(1L, "OPEN");

        assertNotNull(result);
    }
    @Test
    void testGetByEmailEmpty() {

        when(userClient.getUserByEmail(anyString()))
                .thenReturn(user);

        when(repo.findByUserId(anyLong()))
                .thenReturn(new ArrayList<>());

        List<Complaint> result =
                service.getByEmail("test@gmail.com");

        assertTrue(result.isEmpty());
    }
    @Test
    void testAssignToAdminNotificationFailure() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        when(repo.save(any()))
                .thenReturn(complaint);

        when(userClient.getUserById(anyLong()))
                .thenReturn(user);

        doThrow(new RuntimeException("Kafka failed"))
                .when(kafkaProducerService)
                .sendNotification(any());

        Complaint result =
                service.assignToAdmin(1L, 2L);

        assertNotNull(result);

        verify(repo).save(any());
    }
    @Test
    void testUpdateStatusNotificationFailure() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        when(repo.save(any()))
                .thenReturn(complaint);

        when(userClient.getUserById(anyLong()))
                .thenReturn(user);

        doThrow(new RuntimeException("Kafka failed"))
                .when(kafkaProducerService)
                .sendNotification(any());

        Complaint result =
                service.updateStatus(1L, "RESOLVED");

        assertNotNull(result);
    }
    @Test
    void testCreateComplaintNotificationFailure() {

        ComplaintDTO dto = new ComplaintDTO();
        dto.setTitle("Issue");
        dto.setDescription("Testing");

        when(userClient.getUserByEmail(anyString()))
                .thenReturn(user);

        when(repo.save(any()))
                .thenReturn(complaint);

        doThrow(new RuntimeException())
                .when(kafkaProducerService)
                .sendNotification(any());

        Complaint result =
                service.createComplaint(dto,
                        "test@gmail.com");

        assertNotNull(result);
    }
    @Test
    void testUpdateStatusLowerCase() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        when(repo.save(any()))
                .thenReturn(complaint);

        when(userClient.getUserById(anyLong()))
                .thenReturn(user);

        Complaint result =
                service.updateStatus(1L,
                        "resolved");

        assertEquals(ComplaintStatus.RESOLVED,
                result.getStatus());
    }
    @Test
    void testGetByEmailEmptyResult() {

        when(userClient.getUserByEmail(anyString()))
                .thenReturn(user);

        when(repo.findByUserId(anyLong()))
                .thenReturn(new ArrayList<>());

        List<Complaint> result =
                service.getByEmail("abc@gmail.com");

        assertTrue(result.isEmpty());
    }
    @Test
    void testGetAllComplaintsMultiple() {

        List<Complaint> complaints =
                Arrays.asList(
                        complaint,
                        new Complaint()
                );

        when(repo.findAll())
                .thenReturn(complaints);

        List<Complaint> result =
                service.getAllComplaints();

        assertEquals(2, result.size());
    }
    @Test
    void testUpdateComplaintSuccess() {

        complaint.setTitle("Updated");

        when(repo.save(any()))
                .thenReturn(complaint);

        Complaint result =
                service.update(complaint);

        assertEquals(
                "Updated",
                result.getTitle()
        );
    }
   
    @Test
    void testGetByUserIdEmpty() {

        when(repo.findByUserId(anyLong()))
                .thenReturn(new ArrayList<>());

        List<Complaint> result =
                service.getByUserId(1L);

        assertTrue(result.isEmpty());
    }
    @Test
    void testUpdateStatusOpen() {

        when(repo.findById(anyLong()))
                .thenReturn(Optional.of(complaint));

        when(repo.save(any()))
                .thenReturn(complaint);

        when(userClient.getUserById(anyLong()))
                .thenReturn(user);

        Complaint result =
                service.updateStatus(1L, "OPEN");

        assertEquals(
                ComplaintStatus.OPEN,
                result.getStatus()
        );
    }
}
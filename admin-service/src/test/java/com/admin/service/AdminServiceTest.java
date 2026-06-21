package com.admin.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.admin.client.ComplaintClient;
import com.admin.dto.AdminActionDTO;
import com.admin.dto.AdminDto;
import com.admin.entity.Admin;
import com.admin.entity.AdminAction;
import com.admin.exception.AdminNotFoundException;
import com.admin.repository.AdminActionRepository;
import com.admin.repository.AdminRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private AdminRepository adminRepo;

    @Mock
    private AdminActionRepository actionRepo;

    @Mock
    private ComplaintClient complaintClient;

    @InjectMocks
    private AdminService service;

    private Admin admin;
    private AdminAction action;

    @BeforeEach
    void setup() {

        admin = new Admin();
        admin.setId(1L);
        admin.setName("Test Admin");
        admin.setEmail("admin@gmail.com");
        admin.setRole("ADMIN");

        action = new AdminAction();
        action.setId(1L);
        action.setPriority("HIGH");
        action.setStatus("ASSIGNED");
    }

    @Test
    void testSaveAdmin() {

        AdminDto dto = new AdminDto();
        dto.setName("Test Admin");
        dto.setEmail("admin@gmail.com");
        dto.setRole("ROLE_ADMIN");

        when(adminRepo.save(any(Admin.class))).thenReturn(admin);

        Admin saved = service.saveAdmin(dto);

        assertNotNull(saved);
        assertEquals("ADMIN", saved.getRole());
    }

    @Test
    void testSaveAdmin_EmailEmpty() {

        AdminDto dto = new AdminDto();
        dto.setEmail("");

        assertThrows(IllegalArgumentException.class,
                () -> service.saveAdmin(dto));
    }

    @Test
    void testAssignComplaint() {

        AdminActionDTO dto = new AdminActionDTO();
        dto.setStatus("ASSIGNED");
        dto.setPriority("HIGH");

        when(actionRepo.save(any(AdminAction.class))).thenReturn(action);

        AdminAction result = service.assignComplaint(dto);

        assertEquals("HIGH", result.getPriority());
        assertEquals("ASSIGNED", result.getStatus());
    }

    @Test
    void testAssignComplaint_StatusEmpty() {

        AdminActionDTO dto = new AdminActionDTO();
        dto.setStatus("");

        assertThrows(IllegalArgumentException.class,
                () -> service.assignComplaint(dto));
    }

    @Test
    void testGetAllActions() {

        when(actionRepo.findAll())
                .thenReturn(Arrays.asList(action));

        List<AdminAction> list = service.getAllActions();

        assertEquals(1, list.size());
    }

    @Test
    void testUpdatePriority() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.of(action));

        when(actionRepo.save(any(AdminAction.class)))
                .thenReturn(action);

        AdminAction result =
                service.updatePriority(1L, "MEDIUM");

        assertEquals("MEDIUM", result.getPriority());
    }

    @Test
    void testUpdatePriority_NotFound() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(AdminNotFoundException.class,
                () -> service.updatePriority(1L, "HIGH"));
    }

    @Test
    void testUpdateStatus() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.of(action));

        when(actionRepo.save(any(AdminAction.class)))
                .thenReturn(action);

        AdminAction result =
                service.updateStatus(1L, "IN_PROGRESS");

        assertEquals("IN_PROGRESS", result.getStatus());
    }

    @Test
    void testResolve() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.of(action));

        when(actionRepo.save(any(AdminAction.class)))
                .thenReturn(action);

        AdminAction result = service.resolve(1L);

        assertEquals("RESOLVED", result.getStatus());
    }
    @Test
    void testUpdateStatus_NotFound() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(AdminNotFoundException.class,
                () -> service.updateStatus(1L, "OPEN"));
    }

    @Test
    void testResolve_NotFound() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(AdminNotFoundException.class,
                () -> service.resolve(1L));
    }
   
    @Test
    void testSaveAdminRolePrefix() {

        AdminDto dto = new AdminDto();
        dto.setName("Admin");
        dto.setEmail("admin@gmail.com");
        dto.setRole("ROLE_ADMIN");

        Admin cAdmin = new Admin();
        admin.setRole("ADMIN");

        when(adminRepo.save(any())).thenReturn(cAdmin);

        Admin result = service.saveAdmin(dto);

        assertEquals("ADMIN", result.getRole());
    }
    
    @Test
    void testUpdatePriorityNotFound() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service.updatePriority(1L, "HIGH"));
    }
    @Test
    void testUpdateStatusNotFound() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service.updateStatus(1L, "OPEN"));
    }
    @Test
    void testResolveNotFound() {

        when(actionRepo.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service.resolve(1L));
    }
    @Test
    void testUpdateStatusSuccess() {

        AdminAction aAction = new AdminAction();

        when(actionRepo.findById(1L))
                .thenReturn(Optional.of(aAction));

        when(actionRepo.save(any()))
                .thenReturn(aAction);

        assertNotNull(service.updateStatus(1L, "OPEN"));
    }
    @Test
    void testResolveSuccess() {

        AdminAction bAction = new AdminAction();

        when(actionRepo.findById(1L))
                .thenReturn(Optional.of(bAction));

        when(actionRepo.save(any()))
                .thenReturn(bAction);

        assertNotNull(service.resolve(1L));
    }
}
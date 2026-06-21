package com.admin.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import com.admin.dto.AdminActionDTO;
import com.admin.dto.AdminDto;
import com.admin.dto.ComplaintDTO;
import com.admin.entity.Admin;
import com.admin.entity.AdminAction;
import com.admin.service.AdminService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class AdminControllerTest {

    @Mock
    private AdminService service;

    @InjectMocks
    private AdminController controller;

    private Admin admin;
    private AdminAction action;

    @BeforeEach
    void setup() {

        MockitoAnnotations.openMocks(this);

        admin = new Admin();
        admin.setId(1L);
        admin.setName("Admin");

        action = new AdminAction();
        action.setId(1L);
        action.setPriority("HIGH");
        action.setStatus("ASSIGNED");
    }

    @Test
    void testCreateAdmin() {

        AdminDto dto = new AdminDto();

        when(service.saveAdmin(dto)).thenReturn(admin);

        Admin result = controller.createAdmin(dto);

        assertNotNull(result);
    }

    @Test
    void testCreateAction() {

        AdminActionDTO dto = new AdminActionDTO();

        when(service.assignComplaint(dto))
                .thenReturn(action);

        AdminAction result =
                controller.create(dto);

        assertNotNull(result);
    }

    @Test
    void testGetAll() {

        when(service.getAllActions())
                .thenReturn(Arrays.asList(action));

        List<AdminAction> list =
                controller.getAll();

        assertEquals(1, list.size());
    }

    @Test
    void testUpdatePriority() {

        when(service.updatePriority(1L, "HIGH"))
                .thenReturn(action);

        AdminAction result =
                controller.updatePriority(1L, "HIGH");

        assertEquals("HIGH", result.getPriority());
    }

    @Test
    void testUpdateStatus() {

        when(service.updateStatus(1L, "INPROGRESS"))
                .thenReturn(action);

        AdminAction result =
                controller.updateStatus(1L, "INPROGRESS");

        assertEquals("INPROGRESS", result.getStatus());
    }

    @Test
    void testResolve() {

        action.setStatus("RESOLVED");

        when(service.resolve(1L))
                .thenReturn(action);

        AdminAction result =
                controller.resolve(1L);

        assertEquals("RESOLVED", result.getStatus());
    }
    @Test
    void testAssignComplaintPathVariable() {

        when(service.assignComplaint(1L, 2L))
                .thenReturn(new ComplaintDTO());

        ComplaintDTO dto =
                controller.assign(1L, 2L);

        assertNotNull(dto);
    }
    @Test
    void testAssignComplaintEndpoint() {

        ComplaintDTO dto = new ComplaintDTO();

        when(service.assignComplaint(1L, 2L))
                .thenReturn(dto);

        ComplaintDTO result =
                controller.assign(1L, 2L);

        assertNotNull(result);
    }
    @Test
    void testGetAllActions() {

        when(service.getAllActions())
                .thenReturn(List.of(new AdminAction()));

        List<AdminAction> result =
                controller.getAll();

        assertEquals(1, result.size());
    }
    @Test
    void testCreateAdminEndpoint() {

        AdminDto dto = new AdminDto();

        Admin fAdmin = new Admin();

        when(service.saveAdmin(dto))
                .thenReturn(fAdmin);

        assertNotNull(controller.createAdmin(dto));
    }
    @Test
    void testCreateActionEndpoint() {

        AdminActionDTO dto = new AdminActionDTO();

        AdminAction aAction = new AdminAction();

        when(service.assignComplaint(dto))
                .thenReturn(aAction);

        assertNotNull(controller.create(dto));
    }
    @Test
    void testResolveEndpoint() {

        AdminAction bAction = new AdminAction();

        when(service.resolve(1L))
                .thenReturn(bAction);

        assertNotNull(controller.resolve(1L));
    }
    @Test
    void testUpdatePriorityEndpoint() {

        AdminAction cAction = new AdminAction();
        action.setPriority("HIGH");

        when(service.updatePriority(1L, "HIGH"))
                .thenReturn(cAction);

        AdminAction result =
                controller.updatePriority(1L, "HIGH");

        assertEquals("HIGH", result.getPriority());
    }
    @Test
    void testUpdateStatusEndpoint() {

        AdminAction dAction = new AdminAction();
        action.setStatus("OPEN");

        when(service.updateStatus(1L, "OPEN"))
                .thenReturn(dAction);

        AdminAction result =
                controller.updateStatus(1L, "OPEN");

        assertEquals("OPEN", result.getStatus());
    }
    
}
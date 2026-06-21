package com.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;



import com.auth.client.AdminClient;
import com.auth.client.UserClient;
import com.auth.controller.AuthController;
import com.auth.dto.RegisterRequest;
import com.auth.dto.ResetPasswordDTO;
import com.auth.entity.AuthUser;
import com.auth.repository.AuthUserRepository;
import com.auth.security.JwtUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthUserRepository repo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserClient userClient;

    @Mock
    private AdminClient adminClient;

    @InjectMocks
    private AuthService service;

    private AuthUser user;

    @BeforeEach
    void setup() {

        user = new AuthUser();
        user.setId(1L);
        user.setUsername("Test");
        user.setEmail("test@gmail.com");
        user.setPassword("encoded");
        user.setRole("USER");
        user.setStatus("ACTIVE");
    }

    @Test
    void testRegisterUserRole() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Test");
        request.setEmail("test@gmail.com");
        request.setPassword("123");
        request.setRole("USER");

        when(repo.findByEmail(anyString())).thenReturn(null);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        when(repo.save(any(AuthUser.class)))
                .thenReturn(user);

        AuthUser result = service.register(request);

        assertNotNull(result);
        assertEquals("USER", result.getRole());

        verify(userClient).saveUser(any());
    }

    @Test
    void testRegisterAdminRole() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Admin");
        request.setEmail("admin@gmail.com");
        request.setPassword("123");
        request.setRole("ADMIN");

        AuthUser admin = new AuthUser();
        admin.setRole("ADMIN");

        when(repo.findByEmail(anyString())).thenReturn(null);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        when(repo.save(any(AuthUser.class)))
                .thenReturn(admin);

        AuthUser result = service.register(request);

        assertEquals("ADMIN", result.getRole());

        verify(adminClient).saveAdmin(any());
    }

    @Test
    void testRegisterExistingUser() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Test");
        request.setEmail("test@gmail.com");
        request.setPassword("123");
        request.setRole("USER");

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        assertThrows(IllegalStateException.class,
                () -> service.register(request));
    }

    @Test
    void testRegisterNullFields() {

        RegisterRequest request = new RegisterRequest();

        assertThrows(IllegalArgumentException.class,
                () -> service.register(request));
    }

    @Test
    void testLoginSuccess() {

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.matches(anyString(), anyString()))
                .thenReturn(true);

        when(jwtUtil.generateToken(anyString(), anyString()))
                .thenReturn("token");

        String token = service.login("test@gmail.com", "123");

        assertEquals("token", token);
    }

    @Test
    void testLoginUserNotFound() {

        when(repo.findByEmail(anyString()))
                .thenReturn(null);

        assertThrows(IllegalStateException.class,
                () -> service.login("abc@gmail.com", "123"));
    }

    @Test
    void testLoginInvalidPassword() {

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.matches(anyString(), anyString()))
                .thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> service.login("abc@gmail.com", "wrong"));
    }

    @Test
    void testUpdatePasswordSuccess() {

        ResetPasswordDTO dto = new ResetPasswordDTO();
        dto.setEmail("test@gmail.com");
        dto.setNewPassword("123");

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        String result = service.updatePassword(dto);

        assertEquals("Password updated", result);

        verify(repo).save(any());
    }

    @Test
    void testUpdatePasswordUserNotFound() {

        ResetPasswordDTO dto = new ResetPasswordDTO();
        dto.setEmail("abc@gmail.com");

        when(repo.findByEmail(anyString()))
                .thenReturn(null);

        String result = service.updatePassword(dto);

        assertEquals("User not found", result);
    }
    @Test
    void testRegisterAdminBranchCoverage() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Admin");
        request.setEmail("admin@gmail.com");
        request.setPassword("123");
        request.setRole("ADMIN");

        AuthUser adminUser = new AuthUser();
        adminUser.setRole("ADMIN");

        when(repo.findByEmail(anyString()))
                .thenReturn(null);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        when(repo.save(any(AuthUser.class)))
                .thenReturn(adminUser);

        AuthUser result = service.register(request);

        assertNotNull(result);

        verify(adminClient, times(1))
                .saveAdmin(any());
    }
    @Test
    void testRegisterUserBranchCoverage() {

        RegisterRequest request = new RegisterRequest();
        request.setName("User");
        request.setEmail("user@gmail.com");
        request.setPassword("123");
        request.setRole("USER");

        AuthUser normalUser = new AuthUser();
        normalUser.setRole("USER");

        when(repo.findByEmail(anyString()))
                .thenReturn(null);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        when(repo.save(any(AuthUser.class)))
                .thenReturn(normalUser);

        AuthUser result = service.register(request);

        assertNotNull(result);

        verify(userClient, times(1))
                .saveUser(any());
    }
    @Test
    void testPasswordEncodingCoverage() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Test");
        request.setEmail("test@gmail.com");
        request.setPassword("mypassword");
        request.setRole("USER");

        when(repo.findByEmail(anyString()))
                .thenReturn(null);

        when(passwordEncoder.encode("mypassword"))
                .thenReturn("encodedPassword");

        when(repo.save(any(AuthUser.class)))
                .thenAnswer(i -> i.getArgument(0));

        AuthUser result = service.register(request);

        assertEquals("encodedPassword",
                result.getPassword());
    }
    @Test
    void testLoginWrongPasswordBranch() {

        user.setPassword("encoded");

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.matches("wrong", "encoded"))
                .thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> service.login("test@gmail.com", "wrong"));
    }
    @Test
    void testUpdatePasswordEncodingCoverage() {

        ResetPasswordDTO dto =
                new ResetPasswordDTO();

        dto.setEmail("test@gmail.com");
        dto.setNewPassword("new123");

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.encode("new123"))
                .thenReturn("encodedNew");

        String result =
                service.updatePassword(dto);

        assertEquals("Password updated", result);

        assertEquals("encodedNew",
                user.getPassword());
    }
    @Test
    void testRegisterLowerCaseRole() {

        RegisterRequest request =
                new RegisterRequest();

        request.setName("User");
        request.setEmail("user@gmail.com");
        request.setPassword("123");
        request.setRole("user");

        when(repo.findByEmail(anyString()))
                .thenReturn(null);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        when(repo.save(any(AuthUser.class)))
                .thenAnswer(i -> i.getArgument(0));

        AuthUser result =
                service.register(request);

        assertEquals("USER",
                result.getRole());
    }
    @Test
    void testRegisterUnknownRole() {

        RegisterRequest request =
                new RegisterRequest();

        request.setName("Unknown");
        request.setEmail("unknown@gmail.com");
        request.setPassword("123");
        request.setRole("MANAGER");

        when(repo.findByEmail(anyString()))
                .thenReturn(null);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        when(repo.save(any(AuthUser.class)))
                .thenAnswer(i -> i.getArgument(0));

        AuthUser result =
                service.register(request);

        assertNotNull(result);
    }
    @Test
    void testLoginPasswordMatchBranch() {

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.matches(anyString(), anyString()))
                .thenReturn(true);

        when(jwtUtil.generateToken(anyString(), anyString()))
                .thenReturn("token");

        String result =
                service.login("test@gmail.com", "123");

        assertEquals("token", result);
    }
    @Test
    void testUpdatePasswordEncodingVerify() {

        ResetPasswordDTO dto =
                new ResetPasswordDTO();

        dto.setEmail("test@gmail.com");
        dto.setNewPassword("newpass");

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encodedPass");

        service.updatePassword(dto);

        verify(passwordEncoder)
                .encode("newpass");

        verify(repo)
                .save(any(AuthUser.class));
    }
    @Test
    void testControllerConstructor() {

        AuthService mockService =
                mock(AuthService.class);

        AuthController controller =
                new AuthController(mockService);

        assertNotNull(controller);
    }
    @Test
    void testLoginNullPassword() {

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.matches(anyString(), anyString()))
                .thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> service.login("test@gmail.com", null));
    }
    @Test
    void testRegisterEmptyRole() {

        RegisterRequest request =
                new RegisterRequest();

        request.setName("Test");
        request.setEmail("test2@gmail.com");
        request.setPassword("123");
        request.setRole("");

        when(repo.findByEmail(anyString()))
                .thenReturn(null);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        when(repo.save(any(AuthUser.class)))
                .thenAnswer(i -> i.getArgument(0));

        AuthUser result = service.register(request);

        assertNotNull(result);
    }
    @Test
    void testUpdatePasswordNullNewPassword() {

        ResetPasswordDTO dto =
                new ResetPasswordDTO();

        dto.setEmail("test@gmail.com");
        dto.setNewPassword(null);

        when(repo.findByEmail(anyString()))
                .thenReturn(user);

        when(passwordEncoder.encode(any()))
                .thenReturn("encoded");

        String result =
                service.updatePassword(dto);

        assertNotNull(result);
    }
}
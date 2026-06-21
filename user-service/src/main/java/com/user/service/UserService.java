package com.user.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.user.client.AuthClient;
import com.user.client.NotificationClient;
import com.user.dto.NotificationDTO;
import com.user.dto.OtpVerifyDTO;
import com.user.dto.ResetPasswordDTO;
import com.user.dto.UserDTO;
import com.user.entity.User;
import com.user.exception.UserNotFoundException;
import com.user.repository.UserRepository;
@Service
public class UserService {
	private static final Logger log =
	        LoggerFactory.getLogger(UserService.class);
	private static final Random RANDOM = new Random();

    private final UserRepository repo;
    private final AuthClient authClient;
    private final NotificationClient notificationClient;

    public UserService(
            UserRepository repo,
            AuthClient authClient,
            NotificationClient notificationClient) {

        this.repo = repo;
        this.authClient = authClient;
        this.notificationClient = notificationClient;
    }
    private Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, String> forgotOtpStore = new HashMap<>();
    public User createUser(UserDTO dto) {

        if (dto.getName() == null || dto.getName().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());

        return repo.save(user);
    }
    public User getUserByEmail(String email) {
        return repo.findByEmail(email)
                .orElse(null);
    }


    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User getUserById(Long id) {
    	return repo.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id)
                );
    }

    public String deleteUser(Long id) {
    	User user = repo.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id)
                );
        repo.delete(user);
        return "User Deleted Successfully";
    }

public String generateOtp(String email) {
    Random random = RANDOM;
    String otp = String.valueOf(
            100000 + random.nextInt(900000)
    );
    otpStorage.put(email, otp);
    return otp;
}

public boolean verifyOtp(String email, String otp) {
    String storedOtp = otpStorage.get(email);
    if (storedOtp != null && storedOtp.equals(otp)) {
        otpStorage.remove(email);
        return true;
    }
    return false;
}
public String sendForgotPasswordOtp(String email) {

	repo.findByEmail(email)
	        .orElseThrow(() -> new RuntimeException("User not found"));


    String otp = String.valueOf(100000 + RANDOM.nextInt(900000));

    forgotOtpStore.put(email, otp);

    NotificationDTO dto = new NotificationDTO();

    dto.setEmail(email);
    dto.setMessage("Your password reset OTP is: " + otp);

    notificationClient.sendNotification(dto);
    log.info("OTP={}",otp);

    return "OTP sent successfully";
}
public String verifyForgotOtp(OtpVerifyDTO dto) {

    String storedOtp = forgotOtpStore.get(dto.getEmail());

    if (storedOtp == null) {
        return "OTP expired";
    }

    if (!storedOtp.equals(dto.getOtp())) {
        return "Invalid OTP";
    }

    return "OTP verified";
}
public String resetPassword(ResetPasswordDTO dto) {

    if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
        return "Passwords do not match";
    }

    User user = repo.findByEmail(dto.getEmail())
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    

    user.setPassword(dto.getNewPassword());

    repo.save(user);

    authClient.updatePassword(dto);

    forgotOtpStore.remove(dto.getEmail());

    return "Password updated successfully";
}
}
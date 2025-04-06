package org.pfe.cmsservices.service;

import com.pfe.department_service.dto.DepartmentRequest;
import org.pfe.cmsservices.dto.AdminCreateUserRequest;
import org.pfe.cmsservices.entity.User;
import org.pfe.cmsservices.enums.RoleEnum;
import org.pfe.cmsservices.repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;


import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    //private final RestTemplate restTemplate; // Inject RestTemplate

    /**
     * Registers a new user with a username, email, password, and role.
     */
    public User registerUser(String username, String email, String password, RoleEnum role) {
        if (userRepository.existsByUsername(username)) {
            throw new EntityExistsException("Username already exists.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new EntityExistsException("Email already exists.");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();

        logger.info("User registered: {}", username);
        return userRepository.save(user);
    }

    /**
     * Creates a user by admin with a temporary password and sends a verification email.
     */
    public void createUserByAdmin(AdminCreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String tempPassword = UUID.randomUUID().toString().substring(0, 8); // Generate temp password
        String token = UUID.randomUUID().toString(); // Generate verification token

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .role(request.getRole())
                .enabled(false)
                .password(passwordEncoder.encode(tempPassword))
                .verificationToken(token)
                .build();

        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), token);
        logger.info("User created by admin: {}", user.getUsername());
    }

    /**
     * Assigns a department to a user, after validating the department ID.
     */
    @Transactional
  /*  public void assignDepartment(Long userId, Long departmentId) {
        // Call Department Service to validate department exists
        String url = "http://department-service/departments/" + departmentId;
        try {
            restTemplate.getForEntity(url, DepartmentRequest.class); // Ensure department exists
        } catch (RestClientException e) {
            logger.error("Department not found with ID: {}", departmentId);
            throw new RuntimeException("Invalid department ID");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setDepartmentId(departmentId);
        userRepository.save(user);
        logger.info("Assigned department ID: {} to user ID: {}", departmentId, userId);
    }*/

    /**
     * Verifies a user's account using a verification token.
     */
    public void verifyAccount(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        logger.info("Account verified for user: {}", user.getUsername());
    }

    /**
     * Retrieves the currently authenticated user.
     */
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Updates the profile of the currently authenticated user.
     */
    public void updateProfile(User updated) {
        User current = getCurrentUser();
        current.setUsername(updated.getUsername());
        // Allow updating password if necessary
        userRepository.save(current);
        logger.info("Profile updated for user: {}", current.getUsername());
    }
}

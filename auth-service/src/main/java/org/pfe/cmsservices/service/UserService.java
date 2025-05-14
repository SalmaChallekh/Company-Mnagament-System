package org.pfe.cmsservices.service;


import com.pfe.department_service.exception.DepartmentNotFoundException;
import feign.FeignException;
import org.pfe.cmsservices.entity.*;
import org.pfe.cmsservices.enums.RoleEnum;
import org.pfe.cmsservices.exception.DepartmentServiceUnavailableException;
import org.pfe.cmsservices.repository.DepartmentServiceClient;
import org.pfe.cmsservices.repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
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
    private final RestTemplate restTemplate;
    private final DepartmentServiceClient departmentClient;
    private final String departmentServiceUrl = "http://localhost:4002/api/admin/departments/getById/";
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

    // Admin creates profile
    @Transactional
    public void createUserProfile(String email, RoleEnum role, Long deptId) {
        // Validate inputs
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        // Validate department exists (if provided)
        if (deptId != null) {
            validateDepartmentExists(deptId);
        }

        // Create and save user
        User user = createUserWithRole(email, role, deptId);
        userRepository.save(user);

        // Send email outside transaction
        sendActivationEmailAsync(user);
    }

    // Extracted department validation with retry
    @Retryable(value = {FeignException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    private void validateDepartmentExists(Long deptId) {
        try {
            ResponseEntity<Boolean> response = departmentClient.departmentExists(deptId);

            if (!response.getStatusCode().is2xxSuccessful() ||
                    !Boolean.TRUE.equals(response.getBody())) {
                throw new DepartmentNotFoundException(deptId);
            }
        } catch (FeignException e) {
            //log.error("Department service call failed for departmentId: {}", deptId, e);
            throw new DepartmentServiceUnavailableException(
                    "Department service unavailable for department: " + deptId,
                    e
            );
        }
    }

    // Extracted user creation logic
    private User createUserWithRole(String email, RoleEnum role, Long deptId) {
        User user = switch (role) {
            case ROLE_MANAGER -> new Manager();
            case ROLE_FINANCE -> new Finance();
            case ROLE_EMPLOYEE -> new Employee();
            case ROLE_HR -> new HumanRessource();
            default -> throw new IllegalArgumentException("Invalid role: " + role);
        };

        user.setEmail(email);
        user.setRole(role);
        user.setDepartmentId(deptId);
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiry(LocalDateTime.now().plusDays(2));

        return user;
    }

    // Async email sending
    @Async
    public void sendActivationEmailAsync(User user) {
        try {
            emailService.sendActivationEmail(user.getEmail(), user.getVerificationToken());
        } catch (Exception e) {
            //log.error("Failed to send activation email to {}", user.getEmail(), e);
            // Consider implementing a dead letter queue or retry mechanism
        }
    }
    // User completes registration
    public void completeRegistration(String token, String password) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }
}

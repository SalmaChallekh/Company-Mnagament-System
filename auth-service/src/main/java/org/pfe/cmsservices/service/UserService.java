package org.pfe.cmsservices.service;

import com.pfe.department_service.dto.DepartmentRequest;
import org.pfe.cmsservices.dto.AdminCreateUserRequest;
import org.pfe.cmsservices.dto.DepartmentResponse;
import org.pfe.cmsservices.entity.*;
import org.pfe.cmsservices.enums.RoleEnum;
import org.pfe.cmsservices.repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
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
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = switch (role) {
            case ROLE_MANAGER -> new Manager();
            case ROLE_FINANCE -> new Finance();
            case ROLE_EMPLOYEE -> new Employee();
            case ROLE_HR -> new HumanRessource();
            default -> new User(); // for ROLE_ADMIN, ROLE_USER etc.
        };

        user.setEmail(email);
        user.setRole(role);
        user.setDepartmentId(deptId);
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiry(LocalDateTime.now().plusDays(2));

        userRepository.save(user);  // Saves to both tables automatically
        emailService.sendActivationEmail(email, user.getVerificationToken());
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

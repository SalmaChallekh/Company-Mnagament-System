package org.pfe.cmsservices.service;

import com.pfe.department_service.dto.DepartmentRequest;
import org.pfe.cmsservices.dto.AdminCreateUserRequest;
import org.pfe.cmsservices.dto.DepartmentResponse;
import org.pfe.cmsservices.entity.User;
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
    public void createUserProfile(String email, RoleEnum role, Long deptId) {
        User user = User.builder()
                .email(email)
                .role(role)
                .departmentId(deptId)
                .verificationToken(UUID.randomUUID().toString())
                .tokenExpiry(LocalDateTime.now().plusDays(2))
                .build();

        userRepository.save(user);
        emailService.sendActivationEmail(email, user.getVerificationToken());
    }
    /*public void createUserProfile(String email, RoleEnum role, Long deptId) {
        // Validate inputs
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }

        // Check if department exists by calling external service
        try {
            ResponseEntity<Void> response = restTemplate.getForEntity(departmentServiceUrl + deptId, Void.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IllegalArgumentException("Invalid department ID");
            }
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalArgumentException("Department not found");
        } catch (HttpClientErrorException.Forbidden e) {
            throw new SecurityException("Access denied to Department Service");
        } catch (RestClientException e) {
            throw new IllegalStateException("Failed to communicate with Department Service", e);
        }

        // Create user profile
        User user = new User();
        user.setEmail(email);
        user.setRole(role);
        user.setDepartmentId(deptId);
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiry(LocalDateTime.now().plusDays(2));

        // Save and send email
        userRepository.save(user);
        emailService.sendActivationEmail(email, user.getVerificationToken());
    }*/

   /* public void createUserProfile(String email, RoleEnum role, Long deptId) {
        // Call the external service to check if department exists
        try {
            ResponseEntity<Void> response = restTemplate.getForEntity(departmentServiceUrl + deptId, Void.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IllegalArgumentException("Invalid department ID");
            }
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalArgumentException("Department not found");
        }

        User user = new User();
        user.setEmail(email);
        user.setRole(role);
        user.setDepartmentId(deptId);
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiry(LocalDateTime.now().plusDays(2));

        userRepository.save(user);
        emailService.sendActivationEmail(email, user.getVerificationToken());
    }*/



    // 2. User completes registration
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
    /*only for testing*/
    /*public void completeRegistration(String token, String password) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(true);
        user.setVerificationToken(null); // clear the token
        user.setTokenExpiry(null); // optionally clear expiry
        userRepository.save(user);
    }*/

}

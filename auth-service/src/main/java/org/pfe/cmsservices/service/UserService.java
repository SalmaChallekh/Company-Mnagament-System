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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
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
    //private final RestTemplate restTemplate; // Inject RestTemplate
    @Value("${department.service.url}")
    private String departmentServiceUrl;
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

    // 1. Admin creates profile
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

    // 2. User completes registration
    /*public void completeRegistration(String token, String password) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }*/
    /*only for testing*/
    public void completeRegistration(String token, String password) {
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
    }

}

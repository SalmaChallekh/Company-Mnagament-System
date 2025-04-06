package org.pfe.cmsservices.controller;

import lombok.RequiredArgsConstructor;
import org.pfe.cmsservices.dto.AdminCreateUserRequest;
import org.pfe.cmsservices.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Welcome to the Admin Dashboard!";
    }
    @PostMapping("/create-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createUser(@RequestBody AdminCreateUserRequest request) {
        userService.createUserByAdmin(request);
        return ResponseEntity.ok("User created. Verification email sent.");
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam String token) {
        userService.verifyAccount(token);
        return ResponseEntity.ok("Account verified. You can now login.");
    }
}



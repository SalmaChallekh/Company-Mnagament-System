package org.pfe.cmsservices.controller;

import lombok.RequiredArgsConstructor;

import org.pfe.cmsservices.enums.RoleEnum;
import org.pfe.cmsservices.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

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
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public void createUser(@RequestBody CreateUserRequest request) {
        userService.createUserProfile(
                request.email(),
                request.role(),
                request.departmentId()
        );
    }
        public record CreateUserRequest(String email, RoleEnum role, Long departmentId) {}
        public record ActivateRequest(String token, String password) {}
    public record UserDto(Long id, String email, RoleEnum role, Long departmentId, boolean enabled) {}

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

}



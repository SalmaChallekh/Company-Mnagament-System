package org.pfe.cmsservices.controller;

import lombok.RequiredArgsConstructor;
import org.pfe.cmsservices.entity.User;
import org.pfe.cmsservices.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> updateProfile(@RequestBody User user) {
        userService.updateProfile(user);
        return ResponseEntity.ok("Profile updated.");
    }

}


package org.pfe.cmsservices.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/profile")
    public String userProfile() {
        return "Welcome to your user profile!";
    }
}


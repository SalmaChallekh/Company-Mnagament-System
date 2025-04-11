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

}


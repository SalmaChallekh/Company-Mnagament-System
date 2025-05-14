package org.pfe.cmsservices.controller;

import lombok.RequiredArgsConstructor;
import org.pfe.cmsservices.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

}


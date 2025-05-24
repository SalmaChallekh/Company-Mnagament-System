package org.pfe.cmsservices.controller;

import lombok.RequiredArgsConstructor;
import org.pfe.cmsservices.dto.UserDTO;
import org.pfe.cmsservices.entity.User;
import org.pfe.cmsservices.enums.RoleEnum;
import org.pfe.cmsservices.repository.UserRepository;
import org.pfe.cmsservices.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    @GetMapping
    public ResponseEntity<List<User>> getUsersByRole(@RequestParam("role") String role) {
        try {
            RoleEnum roleEnum = RoleEnum.valueOf(role); // no need to .toUpperCase() since enum is already uppercase with ROLE_
            List<User> users = userRepository.findByRole(roleEnum);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    @GetMapping("/by-department/{departmentId}")
    public ResponseEntity<List<UserDTO>> getUsersByDepartment(@PathVariable Long departmentId) {
        List<User> users = userRepository.findByDepartmentId(departmentId);
        List<UserDTO> dtos = users.stream()
                .map(user -> new UserDTO(user.getId(), user.getEmail(), user.getUsername(), user.getRole(), user.isEnabled()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

}


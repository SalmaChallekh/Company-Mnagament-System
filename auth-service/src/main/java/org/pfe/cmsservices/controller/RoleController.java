package org.pfe.cmsservices.controller;

import org.pfe.cmsservices.enums.RoleEnum;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class RoleController {

    @GetMapping("/roles")
    public List<RoleDto> getRoles() {
        return Arrays.stream(RoleEnum.values())
                .map(role -> new RoleDto(toLabel(role), role.name()))
                .collect(Collectors.toList());
    }

    private String toLabel(RoleEnum role) {
        // Map enum to friendly labels if needed, else just role.name()
        return switch (role) {
            case ROLE_USER -> "User";
            case ROLE_ADMIN -> "Admin";
            case ROLE_MANAGER -> "Manager";
            case ROLE_FINANCE -> "Finance";
            case ROLE_EMPLOYEE -> "Employee";
            case ROLE_HR -> "HR";
            default -> role.name();
        };
    }

    public record RoleDto(String label, String value) {}
}

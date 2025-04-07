package com.pfe.department_service.controller;

import com.pfe.department_service.dto.DepartmentRequest;
import com.pfe.department_service.entity.Department;
import com.pfe.department_service.exception.DepartmentNotFoundException;
import com.pfe.department_service.exception.ResourceNotFoundException;
import com.pfe.department_service.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService service;
    private static final Logger log = LoggerFactory.getLogger(DepartmentController.class);
    @PreAuthorize("hasRole('ADMIN')")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody DepartmentRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.debug("Authenticated userrrrrrr: {}", authentication.getName());
        log.debug("User roles: {}", authentication.getAuthorities());
        return new ResponseEntity<>(service.createDepartment(request), HttpStatus.CREATED);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public List<Department> getAllDepartments() {
        return service.getAllDepartments();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getById/{id}")
    public Department getDepartmentById(@PathVariable("id") Long id) {
        return service.getDepartmentById(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable("id") Long id, @RequestBody DepartmentRequest request) {
        try {
            Department updatedDepartment = service.updateDepartment(id, request);
            return ResponseEntity.ok(updatedDepartment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Department not found with id: " + id);
        }
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            service.deleteDepartment(id);  // Service deletes the department
            return ResponseEntity.noContent().build();  // Successfully deleted
        } catch (DepartmentNotFoundException e) {  // Custom exception for non-existent departments
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Department not found");
        }
    }

}


package org.pfe.cmsservices.controller;

import lombok.RequiredArgsConstructor;
import org.pfe.cmsservices.entity.Employee;
import org.pfe.cmsservices.repository.EmployeeRepository;
import org.pfe.cmsservices.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;
    private final EmployeeRepository employeeRepository;
    @GetMapping("/getById/{id}")
    public ResponseEntity<Employee> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getById(id));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Employee>> getAll() {
        return ResponseEntity.ok(employeeService.getAll());
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping("/allIds")
    public ResponseEntity<List<Long>> getAllEmployeeIds() {
        List<Long> ids = employeeRepository.findAll()
                .stream()
                .map(Employee::getId)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ids);
    }

}


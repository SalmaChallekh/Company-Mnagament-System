package org.pfe.cmsservices.service;

import lombok.RequiredArgsConstructor;
import org.pfe.cmsservices.entity.Employee;
import org.pfe.cmsservices.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }
}

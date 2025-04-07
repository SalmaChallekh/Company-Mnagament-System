package com.pfe.department_service.service;

import com.pfe.department_service.Repository.DepartmentRepository;
import com.pfe.department_service.dto.DepartmentRequest;
import com.pfe.department_service.entity.Department;
import com.pfe.department_service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository repo;
    public Department createDepartment(DepartmentRequest request) {
        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        return repo.save(department);
    }

    // Method to get all departments
    public List<Department> getAllDepartments() {
        return repo.findAll();
    }

    // Method to get a department by its ID
    public Department getDepartmentById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    // Method to update a department
    public Department updateDepartment(Long id, DepartmentRequest request) {
        Department department = getDepartmentById(id);
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        return repo.save(department);
    }

    // Method to delete a department
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        repo.delete(department);
    }
}


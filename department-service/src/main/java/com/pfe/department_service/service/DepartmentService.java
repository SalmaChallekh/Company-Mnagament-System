package com.pfe.department_service.service;

import com.pfe.department_service.Repository.DepartmentRepository;
import com.pfe.department_service.dto.DepartmentRequest;
import com.pfe.department_service.entity.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository repo;

    public Department createDepartment(DepartmentRequest request) {
        Department d = new Department();
        d.setName(request.name);
        d.setDescription(request.description);
        return repo.save(d);
    }

    public List<Department> getAllDepartments() {
        return repo.findAll();
    }

    public Department getDepartmentById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Not Found"));
    }

    public void deleteDepartment(Long id) {
        repo.deleteById(id);
    }
}

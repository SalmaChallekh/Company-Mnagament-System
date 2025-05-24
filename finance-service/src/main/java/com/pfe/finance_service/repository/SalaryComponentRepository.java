package com.pfe.finance_service.repository;

import com.pfe.finance_service.entity.SalaryComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalaryComponentRepository extends JpaRepository<SalaryComponent, Long> {
    Optional<SalaryComponent> findByEmployeeId(Long employeeId);
}
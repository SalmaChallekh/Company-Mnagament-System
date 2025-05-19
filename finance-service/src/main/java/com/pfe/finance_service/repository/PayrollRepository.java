package com.pfe.finance_service.repository;

import com.pfe.finance_service.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;


public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByDateBetween(LocalDate start, LocalDate end);
    List<Payroll> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate start, LocalDate end);
}


package com.pfe.finance_service.repository;

import com.pfe.finance_service.entity.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PayslipRepository extends JpaRepository<Payslip, Long> {
    Optional<Payslip> findByEmployeeIdAndPayPeriod(Long employeeId, LocalDate payPeriod);
    List<Payslip> findAllByEmployeeId(Long employeeId);
}

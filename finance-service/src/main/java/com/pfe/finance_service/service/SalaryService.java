package com.pfe.finance_service.service;

import com.pfe.finance_service.entity.Payslip;
import com.pfe.finance_service.entity.SalaryComponent;
import com.pfe.finance_service.repository.PayslipRepository;
import com.pfe.finance_service.repository.SalaryComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private final SalaryComponentRepository salaryComponentRepository;
    private final PayslipRepository payslipRepository;

    public Payslip generatePayslip(Long employeeId, LocalDate payPeriod) {
        SalaryComponent sc = salaryComponentRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Salary info not found for employee " + employeeId));

        // Calculate gross and net salary
        double gross = sc.getBasicSalary() + sc.getTotalAllowances();
        double net = gross - sc.getTotalDeductions();

        // Check if payslip already exists for this period
        Payslip existingPayslip = payslipRepository.findByEmployeeIdAndPayPeriod(employeeId, payPeriod).orElse(null);
        if (existingPayslip != null) {
            return existingPayslip; // return existing to avoid duplication
        }

        Payslip payslip = Payslip.builder()
                .employeeId(employeeId)
                .payPeriod(payPeriod)
                .grossSalary(gross)
                .totalDeductions(sc.getTotalDeductions())
                .netSalary(net)
                .generatedDate(LocalDate.now())
                .build();

        return payslipRepository.save(payslip);
    }

    public Payslip getPayslip(Long employeeId, LocalDate payPeriod) {
        return payslipRepository.findByEmployeeIdAndPayPeriod(employeeId, payPeriod)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));
    }
}
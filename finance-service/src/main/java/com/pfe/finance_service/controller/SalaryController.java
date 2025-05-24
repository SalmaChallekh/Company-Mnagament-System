package com.pfe.finance_service.controller;

import com.pfe.finance_service.entity.Payslip;
import com.pfe.finance_service.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    // Generate payslip for an employee and period
    @PostMapping("/generate")
    public ResponseEntity<Payslip> generatePayslip(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payPeriod) {
        Payslip payslip = salaryService.generatePayslip(employeeId, payPeriod);
        return ResponseEntity.ok(payslip);
    }

    // Get payslip for employee and period
    @GetMapping("/payslip")
    public ResponseEntity<Payslip> getPayslip(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payPeriod) {
        Payslip payslip = salaryService.getPayslip(employeeId, payPeriod);
        return ResponseEntity.ok(payslip);
    }
}
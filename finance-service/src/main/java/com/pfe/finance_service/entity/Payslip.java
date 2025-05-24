package com.pfe.finance_service.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "payslips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payslip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;

    private LocalDate payPeriod;  // e.g., 2025-05-01 for May 2025

    private double grossSalary;

    private double totalDeductions;

    private double netSalary;

    private LocalDate generatedDate;
}
package com.pfe.finance_service.entity;

import com.pfe.finance_service.enums.PayrollStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private LocalDate date;
    private Double baseSalary;
    private Double bonuses;
    private Double deductions;
    private Double totalSalary;

    @Enumerated(EnumType.STRING)
    private PayrollStatus status; // e.g., PENDING, PROCESSED, FAILED
}

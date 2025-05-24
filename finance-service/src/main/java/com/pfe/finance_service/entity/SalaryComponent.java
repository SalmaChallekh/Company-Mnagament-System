package com.pfe.finance_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "salary_components")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;  // reference to Employee in auth_service

    private double basicSalary;

    private double totalAllowances;

    private double totalDeductions;
}
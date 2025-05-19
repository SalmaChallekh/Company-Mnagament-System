package com.pfe.finance_service.dto;

import com.pfe.finance_service.enums.PayrollStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class PayrollRequest {
    private Long employeeId;
    private Double baseSalary;
    private Double bonuses = 0.0;
    private Double deductions = 0.0;
    @Enumerated(EnumType.STRING)
    private PayrollStatus status;
}


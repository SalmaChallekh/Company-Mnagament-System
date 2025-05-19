package com.pfe.finance_service.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private String status; // APPROVED
}

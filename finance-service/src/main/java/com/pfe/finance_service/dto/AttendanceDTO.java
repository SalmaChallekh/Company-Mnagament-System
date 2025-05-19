package com.pfe.finance_service.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceDTO {
    private Long employeeId;
    private LocalDate date;
    private String status; // PRESENT, ABSENT, LATE
}

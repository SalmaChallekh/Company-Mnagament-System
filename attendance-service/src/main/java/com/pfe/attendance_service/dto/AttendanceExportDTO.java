package com.pfe.attendance_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttendanceExportDTO {
    private Long employeeId;
    private String date;
    private String checkIn;
    private String checkOut;
    private String status; // PRESENT, ABSENT, ON_LEAVE
}


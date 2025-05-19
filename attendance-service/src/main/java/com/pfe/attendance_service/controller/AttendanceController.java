package com.pfe.attendance_service.controller;

import com.pfe.attendance_service.entity.Attendance;
import com.pfe.attendance_service.service.AttendanceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService service;

    @PostMapping("/checkin/{userId}")
    public ResponseEntity<Attendance> checkIn(@PathVariable Long userId, HttpServletRequest request) {
        return ResponseEntity.ok(service.checkIn(userId, request));
    }

    @PostMapping("/checkout/{employeeId}")
    public ResponseEntity<Attendance> checkOut(@PathVariable Long employeeId, HttpServletRequest request) {
        return ResponseEntity.ok(service.checkOut(employeeId, request));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getByEmployee(@PathVariable Long employeeId, HttpServletRequest request) {
        return ResponseEntity.ok(service.getByUser(employeeId, request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Attendance>> getAll(HttpServletRequest request) {
        return ResponseEntity.ok(service.getAll(request));
    }
    @GetMapping("/report/daily")
    public ResponseEntity<Map<String, Long>> getDailyReport() {
        return ResponseEntity.ok(service.getReportForDate(LocalDate.now()));
    }

    @GetMapping("/report/weekly")
    public ResponseEntity<Map<String, Long>> getWeeklyReport() {
        return ResponseEntity.ok(service.getReportForLast7Days());
    }
    @GetMapping(value = "/report/daily/csv", produces = "text/csv")
    public void exportDailyCsv(HttpServletResponse response) throws IOException {
        response.setHeader("Content-Disposition", "attachment; filename=daily-attendance.csv");
        service.exportCsvForDate(LocalDate.now(), response.getWriter());
    }
    @GetMapping("/report/daily/excel")
    public void exportExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=daily-attendance.xlsx");

        service.exportExcelForDate(LocalDate.now(), response.getOutputStream());
    }

}


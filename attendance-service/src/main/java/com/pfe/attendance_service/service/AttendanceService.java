package com.pfe.attendance_service.service;

import com.pfe.attendance_service.entity.Attendance;
import com.pfe.attendance_service.entity.LeaveRequest;
import com.pfe.attendance_service.enums.LeaveStatus;
import com.pfe.attendance_service.repository.AttendanceRepository;
import com.pfe.attendance_service.repository.LeaveRequestRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Writer;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository repo;
    private final LeaveRequestRepository leaveRequestRepository;
    private final RestTemplate restTemplate;

    public boolean employeeExists(Long employeeId, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<?> response = restTemplate.exchange(
                    "http://cms-services/api/admin/employees/getById/" + employeeId,
                    HttpMethod.GET,
                    entity,
                    Object.class
            );

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    public Attendance checkIn(Long employeeId, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        if (!employeeExists(employeeId, token)) {
            throw new RuntimeException("Employee does not exist");
        }

        if (isOnApprovedLeave(employeeId, LocalDate.now())) {
            throw new RuntimeException("You are on approved leave and cannot check in today.");
        }

        Optional<Attendance> existing = repo.findByEmployeeIdAndDate(employeeId, LocalDate.now());
        if (existing.isPresent()) {
            throw new RuntimeException("Already checked in today");
        }

        Attendance a = new Attendance();
        a.setEmployeeId(employeeId);
        a.setDate(LocalDate.now());
        a.setCheckIn(LocalDateTime.now());
        a.setStatus("PRESENT");

        return repo.save(a);
    }

    /*public Attendance checkIn(Long employeeId, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !employeeExists(employeeId, token)) {
            throw new RuntimeException("Employee does not exist");
        }

        Optional<Attendance> existing = repo.findByEmployeeIdAndDate(employeeId, LocalDate.now());
        if (existing.isPresent()) {
            throw new RuntimeException("Employee already checked in today");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalTime cutoff = LocalTime.of(9, 0); // 09:00 AM

        String status = now.toLocalTime().isAfter(cutoff) ? "LATE" : "PRESENT";

        Attendance a = new Attendance();
        a.setEmployeeId(employeeId);
        a.setDate(LocalDate.now());
        a.setCheckIn(now);
        a.setStatus(status);

        return repo.save(a);
    }*/


    public Attendance checkOut(Long employeeId, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !employeeExists(employeeId, token)) {
            throw new RuntimeException("Employee does not exist");
        }

        Attendance a = repo.findByEmployeeIdAndDate(employeeId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("Check-in not found for today"));

        a.setCheckOut(LocalDateTime.now());
        return repo.save(a);
    }

    public List<Attendance> getByUser(Long employeeId, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !employeeExists(employeeId, token)) {
            throw new RuntimeException("Employee does not exist");
        }

        return repo.findByEmployeeId(employeeId);
    }

    public List<Attendance> getAll(HttpServletRequest request) {
        // Optional: secure this endpoint with an admin role check via token if needed
        return repo.findAll();
    }
    public void markAbsentees(List<Long> allEmployeeIds) {
        LocalDate today = LocalDate.now();
        for (Long employeeId : allEmployeeIds) {
            boolean alreadyChecked = repo.findByEmployeeIdAndDate(employeeId, today).isPresent();
            if (!alreadyChecked) {
                Attendance absent = new Attendance();
                absent.setEmployeeId(employeeId);
                absent.setDate(today);
                absent.setStatus("ABSENT");
                repo.save(absent);
            }
        }
    }
    public Map<String, Long> getReportForDate(LocalDate date) {
        List<Attendance> records = repo.findByDate(date);
        return records.stream().collect(Collectors.groupingBy(
                Attendance::getStatus,
                Collectors.counting()
        ));
    }

    public Map<String, Long> getReportForLast7Days() {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);

        List<Attendance> all = repo.findAll().stream()
                .filter(a -> !a.getDate().isBefore(weekAgo) && !a.getDate().isAfter(today))
                .collect(Collectors.toList());

        return all.stream().collect(Collectors.groupingBy(
                Attendance::getStatus,
                Collectors.counting()
        ));
    }
    public void exportCsvForDate(LocalDate date, Writer writer) throws IOException {
        List<Attendance> records = repo.findByDate(date);
        PrintWriter pw = new PrintWriter(writer);

        // Header
        pw.println("Employee ID,Date,Check In,Check Out,Status");

        // Data
        for (Attendance a : records) {
            pw.printf("%d,%s,%s,%s,%s%n",
                    a.getEmployeeId(),
                    a.getDate(),
                    a.getCheckIn() != null ? a.getCheckIn().toString() : "",
                    a.getCheckOut() != null ? a.getCheckOut().toString() : "",
                    a.getStatus());
        }

        pw.flush();
    }
    public void exportExcelForDate(LocalDate date, OutputStream out) throws IOException {
        List<Attendance> records = repo.findByDate(date);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Attendance");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Employee ID");
        header.createCell(1).setCellValue("Date");
        header.createCell(2).setCellValue("Check In");
        header.createCell(3).setCellValue("Check Out");
        header.createCell(4).setCellValue("Status");

        int rowIdx = 1;
        for (Attendance a : records) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(a.getEmployeeId());
            row.createCell(1).setCellValue(a.getDate().toString());
            row.createCell(2).setCellValue(a.getCheckIn() != null ? a.getCheckIn().toString() : "");
            row.createCell(3).setCellValue(a.getCheckOut() != null ? a.getCheckOut().toString() : "");
            row.createCell(4).setCellValue(a.getStatus());
        }

        workbook.write(out);
        workbook.close();
    }
    public boolean isOnApprovedLeave(Long employeeId, LocalDate date) {
        List<LeaveRequest> approvedLeaves = leaveRequestRepository.findByEmployeeIdAndStatus(employeeId, LeaveStatus.APPROVED);

        return approvedLeaves.stream()
                .anyMatch(leave ->
                        !date.isBefore(leave.getStartDate()) &&
                                !date.isAfter(leave.getEndDate())
                );
    }

}


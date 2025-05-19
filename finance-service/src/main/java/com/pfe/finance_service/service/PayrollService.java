package com.pfe.finance_service.service;

import com.pfe.finance_service.entity.Payroll;
import com.pfe.finance_service.enums.PayrollStatus;
import com.pfe.finance_service.repository.PayrollRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepo;
    private final RestTemplate restTemplate;

    // Integrate attendance and leave services
    public Payroll generatePayroll(Long employeeId, Double baseSalary, Double bonuses, Double deductions, String status, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        int totalWorkingDays = getTotalWorkingDays(employeeId, token);
        int totalLeaves = getTotalApprovedLeaves(employeeId, token);

        double leaveDeduction = totalLeaves * (baseSalary / 22); // 22 working days/month
        double finalDeductions = deductions + leaveDeduction;

        Payroll payroll = new Payroll();
        payroll.setEmployeeId(employeeId);
        payroll.setDate(LocalDate.now());
        payroll.setBaseSalary(baseSalary);
        payroll.setBonuses(bonuses);
        payroll.setDeductions(finalDeductions);
        payroll.setTotalSalary(baseSalary + bonuses - finalDeductions);
        payroll.setStatus(PayrollStatus.PROCESSED);

        return payrollRepo.save(payroll);
    }

    private int getTotalWorkingDays(Long employeeId, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Integer> response = restTemplate.exchange(
                    "http://attendance-service/api/attendance/employee/" + employeeId + "/count-present",
                    HttpMethod.GET, entity, Integer.class
            );
            return response.getBody() != null ? response.getBody() : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    private int getTotalApprovedLeaves(Long employeeId, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Integer> response = restTemplate.exchange(
                    "http://attendance-service/api/leaves/employee/" + employeeId + "/approved-count",
                    HttpMethod.GET, entity, Integer.class
            );
            return response.getBody() != null ? response.getBody() : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    public List<Payroll> getAllPayrolls() {
        return payrollRepo.findAll();
    }

    public void exportToCsv(LocalDate month, Writer writer) throws IOException {
        LocalDate start = month.withDayOfMonth(1);
        LocalDate end = start.plusMonths(1).minusDays(1);

        List<Payroll> payrolls = payrollRepo.findByDateBetween(start, end);
        PrintWriter pw = new PrintWriter(writer);
        pw.println("Employee ID,Date,Base Salary,Bonuses,Deductions,Total Salary,Status");

        for (Payroll p : payrolls) {
            pw.printf("%d,%s,%.2f,%.2f,%.2f,%.2f,%s%n",
                    p.getEmployeeId(), p.getDate(), p.getBaseSalary(),
                    p.getBonuses(), p.getDeductions(),
                    p.getTotalSalary(), p.getStatus());
        }
        pw.flush();
    }

    public void exportToExcel(LocalDate month, OutputStream outputStream) throws IOException {
        LocalDate start = month.withDayOfMonth(1);
        LocalDate end = start.plusMonths(1).minusDays(1);
        List<Payroll> payrolls = payrollRepo.findByDateBetween(start, end);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Payroll Report");

        Row header = sheet.createRow(0);
        String[] columns = {"Employee ID", "Date", "Base Salary", "Bonuses", "Deductions", "Total Salary", "Status"};
        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        int rowIndex = 1;
        for (Payroll p : payrolls) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(p.getEmployeeId());
            row.createCell(1).setCellValue(p.getDate().toString());
            row.createCell(2).setCellValue(p.getBaseSalary());
            row.createCell(3).setCellValue(p.getBonuses());
            row.createCell(4).setCellValue(p.getDeductions());
            row.createCell(5).setCellValue(p.getTotalSalary());
            row.createCell(6).setCellValue(p.getStatus().toString());
        }

        workbook.write(outputStream);
        workbook.close();
    }
}

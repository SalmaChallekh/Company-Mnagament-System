package com.pfe.finance_service.controller;

import com.pfe.finance_service.dto.PayrollRequest;
import com.pfe.finance_service.entity.Payroll;
import com.pfe.finance_service.service.PayrollService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService service;

    @PostMapping("/generate")
    public ResponseEntity<Payroll> generatePayroll(
            @RequestBody PayrollRequest request,
            HttpServletRequest httpRequest
    ) {
        Payroll payroll = service.generatePayroll(
                request.getEmployeeId(),
                request.getBaseSalary(),
                request.getBonuses(),
                request.getDeductions(),
                String.valueOf(request.getStatus()),
                httpRequest
        );
        return ResponseEntity.ok(payroll);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Payroll>> getAllPayrolls() {
        return ResponseEntity.ok(service.getAllPayrolls());
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(baos);
        service.exportToCsv(month, writer);
        writer.close();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=payroll.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(baos.toByteArray());
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        service.exportToExcel(month, baos);
        baos.close();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=payroll.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(baos.toByteArray());
    }
}


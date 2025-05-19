package com.pfe.attendance_service.controller;

import com.pfe.attendance_service.entity.LeaveRequest;
import com.pfe.attendance_service.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService service;

    @PostMapping("/submit")
    public ResponseEntity<LeaveRequest> submit(@RequestBody LeaveRequest request) {
        return ResponseEntity.ok(service.submitLeave(request));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<LeaveRequest> approve(@PathVariable Long id) {
        return ResponseEntity.ok(service.approve(id));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<LeaveRequest> reject(@PathVariable Long id) {
        return ResponseEntity.ok(service.reject(id));
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<List<LeaveRequest>> getByEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(service.getByEmployee(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPending() {
        return ResponseEntity.ok(service.getPending());
    }
}

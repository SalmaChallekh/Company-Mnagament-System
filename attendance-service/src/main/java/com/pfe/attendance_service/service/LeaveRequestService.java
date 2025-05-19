package com.pfe.attendance_service.service;

import com.pfe.attendance_service.entity.LeaveRequest;
import com.pfe.attendance_service.enums.LeaveStatus;
import com.pfe.attendance_service.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository repo;

    public LeaveRequest submitLeave(LeaveRequest request) {
        request.setStatus(LeaveStatus.PENDING);
        request.setSubmittedAt(LocalDateTime.now());
        return repo.save(request);
    }

    public LeaveRequest approve(Long requestId) {
        LeaveRequest req = repo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));
        req.setStatus(LeaveStatus.APPROVED);
        return repo.save(req);
    }

    public LeaveRequest reject(Long requestId) {
        LeaveRequest req = repo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));
        req.setStatus(LeaveStatus.REJECTED);
        return repo.save(req);
    }

    public List<LeaveRequest> getByEmployee(Long employeeId) {
        return repo.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getAll() {
        return repo.findAll();
    }

    public List<LeaveRequest> getPending() {
        return repo.findByStatus(LeaveStatus.PENDING);
    }
}

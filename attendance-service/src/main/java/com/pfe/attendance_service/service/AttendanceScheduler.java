package com.pfe.attendance_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AttendanceScheduler {

    private final AttendanceService attendanceService;
    private final RestTemplate restTemplate;

    @Scheduled(cron = "0 0 18 * * ?") // Every day at 18:00
    public void runAbsenceCheck() {
        String token = "Bearer YOUR_ADMIN_TOKEN_HERE"; // or fetch from secure store

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Long[]> response = restTemplate.exchange(
                    "http://cms-services/api/admin/employees/allIds", // You must expose this endpoint
                    HttpMethod.GET,
                    entity,
                    Long[].class
            );

            List<Long> allIds = Arrays.asList(response.getBody());
            attendanceService.markAbsentees(allIds);
        } catch (Exception e) {
            System.err.println("❌ Failed to mark absentees: " + e.getMessage());
        }
    }
}

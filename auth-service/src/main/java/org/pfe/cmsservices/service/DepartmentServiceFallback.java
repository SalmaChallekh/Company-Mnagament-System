package org.pfe.cmsservices.service;

import com.pfe.department_service.dto.DepartmentResponse;
import lombok.extern.slf4j.Slf4j;
import org.pfe.cmsservices.repository.DepartmentServiceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DepartmentServiceFallback implements DepartmentServiceClient {

    @Override
    public ResponseEntity<Boolean> departmentExists(Long id) {
        log.warn("Fallback triggered for departmentExists");
        return ResponseEntity.ok(false); // Safe default
    }

    @Override
    public ResponseEntity<DepartmentResponse> getDepartmentInfo(Long id) {
        log.warn("Fallback triggered for getDepartmentInfo");
        return ResponseEntity.notFound().build();
    }
}
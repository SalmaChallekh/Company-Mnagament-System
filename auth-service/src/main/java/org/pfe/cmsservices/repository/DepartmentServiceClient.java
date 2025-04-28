package org.pfe.cmsservices.repository;

import com.pfe.department_service.dto.DepartmentResponse;
import org.pfe.cmsservices.config.FeignConfig;
import org.pfe.cmsservices.service.DepartmentServiceFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "department-service",
        configuration = FeignConfig.class,
        fallback = DepartmentServiceFallback.class)
public interface DepartmentServiceClient {
    @GetMapping("/api/admin/departments/exists/{id}")
    ResponseEntity<Boolean> departmentExists(@PathVariable("id") Long id);

    @GetMapping("/api/admin/departments/public/{id}")
    ResponseEntity<DepartmentResponse> getDepartmentInfo(@PathVariable("id") Long id);
}

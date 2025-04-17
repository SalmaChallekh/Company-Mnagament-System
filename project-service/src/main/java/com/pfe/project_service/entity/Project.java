package com.pfe.project_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection="projects")
@Data

public class Project {
    @Id
    private String id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private Long ownerId;
    private Long departmentId; // Reference to department-service
    public enum ProjectStatus {
        PLANNED, IN_PROGRESS, COMPLETED, ON_HOLD
    }
}

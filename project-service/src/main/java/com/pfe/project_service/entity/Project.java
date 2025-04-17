package com.pfe.project_service.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection="projects")
@Data
@AllArgsConstructor
public class Project {
    @Id
    private String id;
    private String name;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private ProjectStatus status;
    private Long ownerId;
    private Long departmentId;
    public enum ProjectStatus {
        PLANNED, IN_PROGRESS, COMPLETED, ON_HOLD
    }

    @JsonManagedReference
    @DBRef(lazy = true)
    private List<Task> tasks = new ArrayList<>();
}

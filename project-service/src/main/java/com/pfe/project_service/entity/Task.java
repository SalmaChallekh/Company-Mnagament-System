package com.pfe.project_service.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection="tasks")
@Data
public class Task {
    @Id
    private String id;
    private String name;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private String status;
    private String priority;
    private String assignedTo;
    @DBRef
    @JsonIgnore
    private Project project;
    private String projectId;
    public Task() {}
    public void setProject(Project project) {
        this.project = project;
        this.projectId = project != null ? project.getId() : null;
    }
}

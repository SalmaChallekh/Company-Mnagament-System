package com.pfe.project_service.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="tasks")
@Data
public class Task {
    @Id
    private String id;
    private String name;
    private String description;
    private String status;
    private String priority;
    private String assignedTo;
    @DBRef
    @JsonIgnore
    private Project project;
    private String projectId;
    @PersistenceConstructor
    public Task(String id, String name, String description, String status,
                String priority, String assignedTo, Project project, String projectId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assignedTo = assignedTo;
        this.project = project;
        this.projectId = project != null ? project.getId() : projectId;
    }
    public Task() {}
    public void setProject(Project project) {
        this.project = project;
        this.projectId = project != null ? project.getId() : null;
    }
}

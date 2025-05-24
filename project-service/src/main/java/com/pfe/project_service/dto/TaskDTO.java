package com.pfe.project_service.dto;

import com.pfe.project_service.entity.Task;
import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {
    private String id;
    private String name;
    private String description;

    private String status;
    private String priority;
    private String assignedTo;
    private String projectId;

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.description = task.getDescription();
        this.status = task.getStatus();
        this.priority = task.getPriority();
        this.assignedTo = task.getAssignedTo();
        this.projectId = task.getProject() != null ? task.getProject().getId() : null;
    }
}

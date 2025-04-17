package com.pfe.project_service.dto;

import com.pfe.project_service.entity.Project;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO {
    private String id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Project.ProjectStatus status;
    private Long ownerId;
    private Long departmentId;
    private List<TaskDTO> tasks;

    public ProjectDTO(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.startDate = project.getStartDate();
        this.endDate = project.getEndDate();
        this.status = project.getStatus();
        this.ownerId = project.getOwnerId();
        this.departmentId = project.getDepartmentId();
        this.tasks = project.getTasks() != null
                ? project.getTasks().stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList())
                : new ArrayList<>();
    }

}

package com.pfe.project_service.controller;

import com.pfe.project_service.dto.ProjectDTO;
import com.pfe.project_service.dto.TaskDTO;
import com.pfe.project_service.entity.Project;
import com.pfe.project_service.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ProjectDTO> createProject(@RequestBody Project project) {
        return new ResponseEntity<>(
                new ProjectDTO(projectService.createProject(project)),
                HttpStatus.CREATED
        );
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectWithTasks(id));
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @GetMapping("getAll")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProject().stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(projects);
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<TaskDTO> addTaskToProject(
            @PathVariable String projectId,
            @RequestBody TaskDTO taskDTO) {
        return new ResponseEntity<>(
                projectService.addTaskToProject(projectId, taskDTO),
                HttpStatus.CREATED
        );
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectId(@PathVariable String projectId) {
        List<TaskDTO> tasks = projectService.getTasksByProjectId(projectId).stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tasks);
    }
}
/*

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProject());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project projectDetails) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }


}*/

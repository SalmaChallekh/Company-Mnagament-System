package com.pfe.project_service.controller;

import com.pfe.project_service.dto.ProjectDTO;
import com.pfe.project_service.dto.TaskDTO;
import com.pfe.project_service.entity.Project;
import com.pfe.project_service.entity.Task;
import com.pfe.project_service.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<ProjectDTO> createProject(@RequestBody Project project) {
        return new ResponseEntity<>(
                new ProjectDTO(projectService.createProject(project)),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectWithTasks(id));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProject().stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(projects);
    }

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<TaskDTO> addTaskToProject(
            @PathVariable String projectId,
            @RequestBody TaskDTO taskDTO) {
        return new ResponseEntity<>(
                projectService.addTaskToProject(projectId, taskDTO),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectId(@PathVariable String projectId) {
        List<TaskDTO> tasks = projectService.getTasksByProjectId(projectId).stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tasks);
    }
}
/*@RestController
@RequestMapping("api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return new ResponseEntity<>(projectService.createProject(project), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

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

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<Task> addTaskToProject(@PathVariable String projectId, @RequestBody Task task) {
        return new ResponseEntity<>(
                projectService.addTaskToProject(projectId, task),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<Task>> getTasksByProjectId(@PathVariable String projectId) {
        return ResponseEntity.ok(projectService.getTasksByProjectId(projectId));
    }

}*/

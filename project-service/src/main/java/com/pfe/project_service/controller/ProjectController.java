package com.pfe.project_service.controller;

import com.pfe.project_service.entity.Project;
import com.pfe.project_service.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return new ResponseEntity<>(projectService.createProject(project), HttpStatus.CREATED);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("getAll")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProject());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project projectDetails) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDetails));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}

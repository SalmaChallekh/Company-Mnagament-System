package com.pfe.project_service.controller;

import com.pfe.project_service.entity.Task;
import com.pfe.project_service.repository.ProjectRepository;
import com.pfe.project_service.repository.TaskRepository;
import com.pfe.project_service.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final TaskRepository taskRepo;
    private final ProjectRepository projectRepo;
    @PostMapping("/create")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        System.out.println("Received Task: " + task);
        return new ResponseEntity<>(taskService.createTask(task), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<List<Task>>getAllTasks(){
        return ResponseEntity.ok(taskService.getAllTasks());
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @GetMapping("/getById/{id}")
    public ResponseEntity<Task>getTaskById(@PathVariable String id){
        return ResponseEntity.ok(taskService.getTaskById(id));
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Task>deleteTask(@PathVariable String id){
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/by-project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(taskRepo.findByProjectId(projectId));
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable String taskId,
            @RequestBody Map<String, String> body
    ) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(body.get("status"));
        return ResponseEntity.ok(taskRepo.save(task));
    }
}

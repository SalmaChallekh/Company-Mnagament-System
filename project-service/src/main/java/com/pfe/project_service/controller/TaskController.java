package com.pfe.project_service.controller;

import com.pfe.project_service.entity.Task;
import com.pfe.project_service.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    @PostMapping("/create")
    public ResponseEntity<Task>createTask(@RequestBody Task task){
        return new ResponseEntity<>(taskService.createTask(task), HttpStatus.CREATED);
    }
    @GetMapping("/getAll")
    public ResponseEntity<List<Task>>getAllTasks(){
        return ResponseEntity.ok(taskService.getAllTasks());
    }
    @GetMapping("/getById/{id}")
    public ResponseEntity<Task>getTaskById(@PathVariable String id){
        return ResponseEntity.ok(taskService.getTaskById(id));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Task>deleteTask(@PathVariable String id){
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}

package com.pfe.project_service.service;

import com.pfe.project_service.entity.Task;
import com.pfe.project_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskrepository;
    public Task createTask(Task task){
        return taskrepository.save(task);
    }
    public Task getTaskById(String id){
        return taskrepository.findById(id).orElse(null);
    }
    public List<Task> getAllTasks(){
        return taskrepository.findAll();
    }
    public void deleteTask(String id) {
        taskrepository.deleteById(id);
    }

}

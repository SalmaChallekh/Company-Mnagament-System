package com.pfe.project_service.service;

import com.pfe.project_service.dto.ProjectDTO;
import com.pfe.project_service.dto.TaskDTO;
import com.pfe.project_service.entity.Project;
import com.pfe.project_service.entity.Task;
import com.pfe.project_service.exception.ProjectNotFoundException;
import com.pfe.project_service.repository.ProjectRepository;
import com.pfe.project_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public Project createProject(Project project) {
        if (project.getTasks() == null) {
            project.setTasks(new ArrayList<>());
        }
        return projectRepository.save(project);
    }
    public List<Project> getAllProject() {
        return projectRepository.findAll();
    }
    public ProjectDTO getProjectWithTasks(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        // Ensure tasks list is initialized
        if (project.getTasks() == null) {
            project.setTasks(new ArrayList<>());
        }

        return new ProjectDTO(project);
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));
    }

    public TaskDTO addTaskToProject(String projectId, TaskDTO taskDTO) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        Task task = new Task();
        task.setName(taskDTO.getName());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus());
        task.setPriority(taskDTO.getPriority());
        task.setAssignedTo(taskDTO.getAssignedTo());
        task.setProject(project); // This will also set projectId

        Task savedTask = taskRepository.save(task);

        // Update project's task list
        project.getTasks().add(savedTask);
        projectRepository.save(project);

        return new TaskDTO(savedTask);
    }

    public List<Task> getTasksByProjectId(String projectId) {
        // Verify project exists
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException("Project not found");
        }
        return taskRepository.findByProjectId(projectId);
    }
}
/*@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));
    }

    public List<Project> getAllProject() {
        return projectRepository.findAll();
    }

    public Project updateProject(String id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setStartDate(projectDetails.getStartDate());
        project.setEndDate(projectDetails.getEndDate());
        project.setStatus(projectDetails.getStatus());
        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(String id) {
        // First delete all tasks
        taskRepository.deleteByProjectId(id);
        // Then delete the project
        projectRepository.deleteById(id);
    }

    public Task addTaskToProject(String projectId, Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        // Set both sides of the relationship
        task.setProject(project);
        Task savedTask = taskRepository.save(task);

        // Update the project's task list
        project.getTasks().add(savedTask);
        projectRepository.save(project);

        return savedTask;
    }

    public List<Task> getTasksByProjectId(String projectId) {
        getProjectById(projectId); // Verify project exists
        return taskRepository.findByProjectId(projectId);
    }
}*/

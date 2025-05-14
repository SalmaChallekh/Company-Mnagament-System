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
    /*public Project updateProject(Project updatedProject) {
        Project existingProject = projectRepository.findById(updatedProject.getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Optional: update only allowed fields
        existingProject.setName(updatedProject.getName());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setStartDate(updatedProject.getStartDate());
        existingProject.setEndDate(updatedProject.getEndDate());
        //existingProject.setStatus(updatedProject.setProjectStatus());


        return projectRepository.save(existingProject);
    }*/
    public Project updateProject(Project project) {
        // Verify project exists
        if (!projectRepository.existsById(project.getId())) {
            throw new ProjectNotFoundException("Project not found with id: " + project.getId());
        }

        // Update the project
        return projectRepository.save(project);
    }
    public void deleteProject(String id) {
        // First delete all tasks associated with the project
        List<Task> tasks = taskRepository.findByProjectId(id);
        taskRepository.deleteAll(tasks);

        // Then delete the project
        projectRepository.deleteById(id);
    }
}

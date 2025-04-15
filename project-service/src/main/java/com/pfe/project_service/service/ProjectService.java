package com.pfe.project_service.service;

import com.pfe.project_service.entity.Project;
import com.pfe.project_service.exception.ProjectNotFoundException;
import com.pfe.project_service.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    public Project createProject(Project project){
        return projectRepository.save(project);
    }
    public Project getProjectById(String id){
        return projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + id));
    }
    public List<Project> getAllProject(){
        return projectRepository.findAll();
    }
    public Project updateProject(String id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setStartDate(projectDetails.getStartDate());
        project.setEndDate(projectDetails.getEndDate());
        //project.setStatus(projectDetails.getStatus());
        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
}

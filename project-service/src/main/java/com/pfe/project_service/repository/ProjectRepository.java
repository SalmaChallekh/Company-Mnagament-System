package com.pfe.project_service.repository;

import com.pfe.project_service.entity.Project;
import com.pfe.project_service.entity.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project,String> {
    List<Project> findByOwnerId(Long ownerId);
    List<Project> findByDepartmentId(Long departmentId);
}

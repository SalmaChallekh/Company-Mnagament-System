package com.pfe.project_service.repository;

import com.pfe.project_service.entity.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    @Query("{ 'project.$id': ObjectId(?0) }")
    List<Task> findByProjectId(String projectId);

    @Query(value = "{ 'project.$id': ObjectId(?0) }", delete = true)
    void deleteByProjectId(String projectId);
}

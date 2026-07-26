package com.suchitra.plantcarescheduler.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.CareTask;
import com.suchitra.plantcarescheduler.exception.ResourceNotFoundException;
import com.suchitra.plantcarescheduler.mapper.CareTaskMapper;
import com.suchitra.plantcarescheduler.repository.CareTaskRepository;
import com.suchitra.plantcarescheduler.repository.PlantRepository;

@Service
public class CareTaskService {

    private final CareTaskRepository careTaskRepository;
    private final PlantRepository plantRepository;
    private final CareTaskMapper careTaskMapper;

    public CareTaskService(CareTaskRepository careTaskRepository, CareTaskMapper careTaskMapper, PlantRepository plantRepository) {
        this.careTaskRepository = careTaskRepository;
        this.plantRepository = plantRepository;
        this.careTaskMapper = careTaskMapper;
    }

    // Add Task
    public CareTask addTask(CareTask task) {

        task.setCreatedDate(LocalDateTime.now());

        return careTaskRepository.save(task);
    }

    // Get All Tasks
    public List<CareTask> getAllTasks() {
        return careTaskRepository.findAll();
    }

    // Get Task By Id
    public CareTask getTaskById(Long id) {

        return careTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    // Get Tasks By Plant Id
    public List<CareTask> getTasksByPlantId(Long plantId) {

        plantRepository.findById(plantId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Plant not found with id: " + plantId));

        return careTaskRepository.findByPlantId(plantId);
    }

    // Update Task
    public CareTask updateTask(Long id, CareTask task) {

        CareTask existingTask = careTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        careTaskMapper.updateEntity(existingTask, task);

        return careTaskRepository.save(existingTask);
    }

    // Complete Task
    public CareTask completeTask(Long id) {

        CareTask task = careTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setStatus("Completed");
        task.setCompletedDate(LocalDateTime.now());

        return careTaskRepository.save(task);
    }

    // Delete Task
    public void deleteTask(Long id) {

        CareTask task = careTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        careTaskRepository.delete(task);
    }
}
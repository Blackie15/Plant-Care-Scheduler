package com.suchitra.plantcarescheduler.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.suchitra.plantcarescheduler.entity.CareTask;
import com.suchitra.plantcarescheduler.mapper.CareTaskMapper;
import com.suchitra.plantcarescheduler.repository.CareTaskRepository;

@Service
public class CareTaskService {

    private final CareTaskRepository careTaskRepository;
    private final CareTaskMapper careTaskMapper;

    public CareTaskService(CareTaskRepository careTaskRepository, CareTaskMapper careTaskMapper) {
        this.careTaskRepository = careTaskRepository;
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
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    // Get Tasks By Plant Id
    public List<CareTask> getTasksByPlantId(Long plantId) {

        return careTaskRepository.findByPlantId(plantId);
    }

    // Update Task
    public CareTask updateTask(Long id, CareTask task) {

        CareTask existingTask = careTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        careTaskMapper.updateEntity(existingTask, task);

        return careTaskRepository.save(existingTask);
    }

    // Complete Task
    public CareTask completeTask(Long id) {

        CareTask task = careTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus("Completed");
        task.setCompletedDate(LocalDateTime.now());

        return careTaskRepository.save(task);
    }

    // Delete Task
    public void deleteTask(Long id) {

        CareTask task = careTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        careTaskRepository.delete(task);
    }
}
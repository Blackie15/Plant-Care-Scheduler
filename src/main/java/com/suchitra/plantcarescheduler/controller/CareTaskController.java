package com.suchitra.plantcarescheduler.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.suchitra.plantcarescheduler.dto.caretaskdto.CareTaskRequestDTO;
import com.suchitra.plantcarescheduler.dto.caretaskdto.CareTaskResponseDTO;
import com.suchitra.plantcarescheduler.entity.CareTask;
import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.mapper.CareTaskMapper;
import com.suchitra.plantcarescheduler.repository.PlantRepository;
import com.suchitra.plantcarescheduler.repository.UserRepository;
import com.suchitra.plantcarescheduler.service.CareTaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class CareTaskController {

    private final CareTaskService careTaskService;
    private final CareTaskMapper careTaskMapper;
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;

    public CareTaskController(CareTaskService careTaskService, CareTaskMapper careTaskMapper, PlantRepository plantRepository, UserRepository userRepository) {
        this.careTaskService = careTaskService;
        this.careTaskMapper = careTaskMapper;
        this.plantRepository = plantRepository;
        this.userRepository = userRepository;
    }

    // Add Task
    @PostMapping
    public ResponseEntity<CareTaskResponseDTO> addTask(
            @Valid @RequestBody CareTaskRequestDTO requestDTO) {

        CareTask task = careTaskMapper.toEntity(requestDTO);

        Plant plant = plantRepository.findById(requestDTO.getPlantId())
                .orElseThrow(() -> new RuntimeException("Plant not found"));
        task.setPlant(plant);

        if (requestDTO.getCompletedById() != null) {
            User user = userRepository.findById(requestDTO.getCompletedById())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setCompletedBy(user);
        }

        CareTask savedTask = careTaskService.addTask(task);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(careTaskMapper.toResponseDTO(savedTask));
    }

    // Get All Tasks
    @GetMapping
    public ResponseEntity<List<CareTaskResponseDTO>> getAllTasks() {

        List<CareTaskResponseDTO> tasks = careTaskService.getAllTasks()
                .stream()
                .map(careTaskMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    // Get Task By Id
    @GetMapping("/{id}")
    public ResponseEntity<CareTaskResponseDTO> getTaskById(@PathVariable Long id) {

        return ResponseEntity.ok(
                careTaskMapper.toResponseDTO(careTaskService.getTaskById(id)));
    }

    // Get Tasks By Plant Id
    @GetMapping("/plant/{plantId}")
    public ResponseEntity<List<CareTaskResponseDTO>> getTasksByPlantId(
            @PathVariable Long plantId) {

        List<CareTaskResponseDTO> tasks = careTaskService.getTasksByPlantId(plantId)
                .stream()
                .map(careTaskMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    // Update Task
    @PutMapping("/{id}")
    public ResponseEntity<CareTaskResponseDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody CareTaskRequestDTO requestDTO) {

        CareTask task = careTaskMapper.toEntity(requestDTO);

        Plant plant = plantRepository.findById(requestDTO.getPlantId())
                .orElseThrow(() -> new RuntimeException("Plant not found"));
        task.setPlant(plant);

        if (requestDTO.getCompletedById() != null) {
            User user = userRepository.findById(requestDTO.getCompletedById())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setCompletedBy(user);
        }

        CareTask updatedTask = careTaskService.updateTask(id, task);

        return ResponseEntity.ok(careTaskMapper.toResponseDTO(updatedTask));
    }

    // Complete Task
    @PatchMapping("/{id}/complete")
    public ResponseEntity<CareTaskResponseDTO> completeTask(@PathVariable Long id) {

        CareTask task = careTaskService.completeTask(id);

        return ResponseEntity.ok(careTaskMapper.toResponseDTO(task));
    }

    // Delete Task
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {

        careTaskService.deleteTask(id);

        return ResponseEntity.ok("Task deleted successfully.");
    }
}